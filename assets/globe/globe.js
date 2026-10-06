/*
 * CwpGlobe: a dependency-free orthographic globe drawn on a canvas.
 * Land is a set of dots (Natural Earth 1:50m, see assets/globe/land-dots.json);
 * markers are clusters of located story actors. It turns slowly on its own,
 * can be dragged, zoomed (wheel, pinch, double-click, buttons) and reports
 * marker hover and clicks.
 */
(function () {
  var DEG = Math.PI / 180;
  var MIN_ZOOM = 0.85;
  var MAX_ZOOM = 4;
  var LAND_URL = '/assets/globe/land-dots.json';
  var landPromise = null;

  var ROLE_COLORS = {
    victim: '#D8412F',
    attacker: '#451DC7',
    vendor: '#228D95',
    authority: '#088A42',
    other: '#817C95',
  };

  function loadLand() {
    if (!landPromise) {
      landPromise = fetch(LAND_URL).then(function (response) {
        if (!response.ok) throw new Error('Land data unavailable');
        return response.json();
      }).then(function (data) {
        var raw = data.points || [];
        var count = raw.length / 2;
        var sinLat = new Float32Array(count);
        var cosLat = new Float32Array(count);
        var lon = new Float32Array(count);
        for (var i = 0; i < count; i++) {
          var lat = raw[i * 2] / 10 * DEG;
          sinLat[i] = Math.sin(lat);
          cosLat[i] = Math.cos(lat);
          lon[i] = raw[i * 2 + 1] / 10 * DEG;
        }
        return { count: count, sinLat: sinLat, cosLat: cosLat, lon: lon };
      }).catch(function (err) {
        landPromise = null;
        throw err;
      });
    }
    return landPromise;
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function CwpGlobe(canvas, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options || {};
    this.lambda = this.options.startLon != null ? -this.options.startLon : -10;
    this.phi = 22;
    this.zoom = 1;
    this.spinSpeed = prefersReducedMotion() ? 0 : 3.2; // degrees per second
    this.clusters = [];
    this.projected = [];
    this.highlight = null;
    this.arcs = [];
    this.hover = null;
    this.land = null;
    this.idleUntil = 0;
    this.animation = null;
    this.destroyed = false;
    this.lastFrame = 0;
    this.dpr = 1;
    this.size = 0;
    this.drag = null;
    this.velocity = { x: 0, y: 0 };
    this.bindEvents();
    this.resize();
    var self = this;
    loadLand().then(function (land) {
      self.land = land;
    }).catch(function () {
      self.land = { count: 0, sinLat: [], cosLat: [], lon: [] };
    });
    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }

  CwpGlobe.ROLE_COLORS = ROLE_COLORS;

  CwpGlobe.prototype.bindEvents = function () {
    var self = this;
    var canvas = this.canvas;
    this.onResize = function () { self.resize(); };
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(this.onResize);
      this.resizeObserver.observe(canvas.parentElement || canvas);
    } else {
      window.addEventListener('resize', this.onResize);
    }

    // Active pointers: one drags (rotates), two pinch (zoom).
    this.pointers = new Map();
    this.pinch = null;
    canvas.addEventListener('pointerdown', function (event) {
      self.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (err) {
        // Capture is a comfort (drags that leave the canvas); never block on it.
      }
      self.velocity = { x: 0, y: 0 };
      self.animation = null;
      self.pauseSpin(6000);
      if (self.pointers.size === 2) {
        self.drag = null;
        self.pinch = { distance: pointerDistance(self.pointers), zoom: self.zoom };
        return;
      }
      if (self.pointers.size === 1) {
        self.drag = { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY,
          moved: false, time: performance.now() };
      }
    });
    canvas.addEventListener('pointermove', function (event) {
      if (self.pointers.has(event.pointerId)) {
        self.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      if (self.pinch && self.pointers.size === 2) {
        var distance = pointerDistance(self.pointers);
        if (self.pinch.distance > 0) self.setZoom(self.pinch.zoom * distance / self.pinch.distance);
        self.pauseSpin(6000);
        return;
      }
      if (self.drag) {
        var dx = event.clientX - self.drag.x;
        var dy = event.clientY - self.drag.y;
        if (Math.abs(event.clientX - self.drag.startX) + Math.abs(event.clientY - self.drag.startY) > 4) {
          self.drag.moved = true;
        }
        var scale = 0.28 / self.zoom;
        self.lambda += dx * scale;
        self.phi = Math.max(-70, Math.min(70, self.phi + dy * scale));
        var now = performance.now();
        var dt = Math.max(1, now - self.drag.time);
        self.velocity = { x: dx * scale / dt * 16, y: dy * scale / dt * 16 };
        self.drag.x = event.clientX;
        self.drag.y = event.clientY;
        self.drag.time = now;
        self.pauseSpin(6000);
        return;
      }
      self.updateHover(event);
    });
    function endPointer(event, cancelled) {
      self.pointers.delete(event.pointerId);
      if (self.pinch) {
        // Leaving a pinch never counts as a click or starts a drag.
        if (self.pointers.size < 2) self.pinch = null;
        self.drag = null;
        return;
      }
      if (!self.drag) return;
      var wasClick = !self.drag.moved && !cancelled;
      self.drag = null;
      if (wasClick) self.handleClick(event);
    }
    canvas.addEventListener('pointerup', function (event) { endPointer(event, false); });
    canvas.addEventListener('pointercancel', function (event) { endPointer(event, true); });
    canvas.addEventListener('pointerleave', function () {
      if (!self.drag) self.setHover(null);
    });
    canvas.addEventListener('wheel', function (event) {
      event.preventDefault();
      self.animation = null;
      self.setZoom(self.zoom * Math.exp(-event.deltaY * 0.0015));
      self.pauseSpin(6000);
    }, { passive: false });
    canvas.addEventListener('dblclick', function (event) {
      event.preventDefault();
      var point = self.unproject(event);
      var target = Math.min(MAX_ZOOM, self.zoom * 1.8);
      if (point) self.focusOn(point.lat, point.lon, target);
      else self.zoomTo(target);
    });
  };

  function pointerDistance(pointers) {
    var list = Array.from(pointers.values());
    if (list.length < 2) return 0;
    return Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y);
  }

  CwpGlobe.MIN_ZOOM = MIN_ZOOM;
  CwpGlobe.MAX_ZOOM = MAX_ZOOM;

  CwpGlobe.prototype.setZoom = function (zoom) {
    this.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  };

  /** Animated zoom around the centre of the view. */
  CwpGlobe.prototype.zoomTo = function (zoom) {
    var target = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    this.animation = {
      start: performance.now(), duration: prefersReducedMotion() ? 1 : 350,
      fromLambda: this.lambda, toLambda: this.lambda, fromPhi: this.phi, toPhi: this.phi,
      fromZoom: this.zoom, toZoom: target,
    };
    this.pauseSpin(8000);
  };

  CwpGlobe.prototype.zoomBy = function (factor) {
    var base = this.animation ? this.animation.toZoom : this.zoom;
    this.zoomTo(base * factor);
  };

  /** Back to the whole globe, keeping the current longitude. */
  CwpGlobe.prototype.resetView = function () {
    this.animation = {
      start: performance.now(), duration: prefersReducedMotion() ? 1 : 600,
      fromLambda: this.lambda, toLambda: this.lambda, fromPhi: this.phi, toPhi: 22,
      fromZoom: this.zoom, toZoom: 1,
    };
    this.idleUntil = 0;
  };

  /** Screen position (pointer event) to latitude/longitude, or null off the sphere. */
  CwpGlobe.prototype.unproject = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    var r = this.radius();
    var x = (event.clientX - rect.left - this.width / 2) / r;
    var y = (this.height / 2 - (event.clientY - rect.top)) / r;
    var d = x * x + y * y;
    if (d > 1) return null;
    var z = Math.sqrt(1 - d);
    var ph = this.phi * DEG;
    var lat = Math.asin(Math.max(-1, Math.min(1, y * Math.cos(ph) + z * Math.sin(ph)))) / DEG;
    var lo = Math.atan2(x, z * Math.cos(ph) - y * Math.sin(ph)) / DEG;
    var lon = ((lo - this.lambda) % 360 + 540) % 360 - 180;
    return { lat: lat, lon: lon };
  };

  CwpGlobe.prototype.pauseSpin = function (ms) {
    this.idleUntil = performance.now() + ms;
  };

  CwpGlobe.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(rect.width));
    var height = Math.max(1, Math.round(rect.height));
    this.dpr = dpr;
    this.width = width;
    this.height = height;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
  };

  CwpGlobe.prototype.radius = function () {
    return Math.min(this.width, this.height) * 0.44 * this.zoom;
  };

  /** Project a latitude/longitude (degrees) to screen space. z > 0 is visible. */
  CwpGlobe.prototype.project = function (lat, lon) {
    var la = lat * DEG;
    var lo = lon * DEG + this.lambda * DEG;
    var ph = this.phi * DEG;
    var cosLat = Math.cos(la);
    var x = cosLat * Math.sin(lo);
    var y = Math.cos(ph) * Math.sin(la) - Math.sin(ph) * cosLat * Math.cos(lo);
    var z = Math.sin(ph) * Math.sin(la) + Math.cos(ph) * cosLat * Math.cos(lo);
    var r = this.radius();
    return { x: this.width / 2 + r * x, y: this.height / 2 - r * y, z: z };
  };

  CwpGlobe.prototype.setClusters = function (clusters) {
    this.clusters = clusters || [];
    this.setHover(null);
  };

  /** Highlight a set of cluster keys (for a selected story) and draw its arcs. */
  CwpGlobe.prototype.setHighlight = function (keys, arcs) {
    this.highlight = keys && keys.length ? new Set(keys) : null;
    this.arcs = arcs || [];
  };

  CwpGlobe.prototype.focusOn = function (lat, lon, zoom) {
    var targetLambda = -lon;
    // Take the short way round.
    var delta = ((targetLambda - this.lambda) % 360 + 540) % 360 - 180;
    this.animation = {
      start: performance.now(), duration: prefersReducedMotion() ? 1 : 900,
      fromLambda: this.lambda, toLambda: this.lambda + delta,
      fromPhi: this.phi, toPhi: Math.max(-60, Math.min(60, lat * 0.85)),
      fromZoom: this.zoom, toZoom: Math.min(MAX_ZOOM, zoom || Math.max(this.zoom, 1.12)),
    };
    this.pauseSpin(12000);
  };

  CwpGlobe.prototype.hitTest = function (event) {
    var rect = this.canvas.getBoundingClientRect();
    var px = event.clientX - rect.left;
    var py = event.clientY - rect.top;
    var best = null;
    var bestDistance = Infinity;
    for (var i = 0; i < this.projected.length; i++) {
      var item = this.projected[i];
      var dx = item.x - px;
      var dy = item.y - py;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= item.r + 6 && distance < bestDistance) {
        best = item.cluster;
        bestDistance = distance;
      }
    }
    return best;
  };

  CwpGlobe.prototype.updateHover = function (event) {
    this.setHover(this.hitTest(event), event);
  };

  CwpGlobe.prototype.setHover = function (cluster, event) {
    var changed = cluster !== this.hover;
    this.hover = cluster;
    this.canvas.style.cursor = cluster ? 'pointer' : (this.drag ? 'grabbing' : 'grab');
    if (this.options.onHover && (changed || cluster)) this.options.onHover(cluster, event);
    if (cluster) this.pauseSpin(2500);
  };

  CwpGlobe.prototype.handleClick = function (event) {
    var cluster = this.hitTest(event);
    if (cluster && this.options.onSelect) this.options.onSelect(cluster);
  };

  CwpGlobe.prototype.frame = function (time) {
    if (this.destroyed) return;
    if (!this.canvas.isConnected) {
      this.destroy();
      return;
    }
    var dt = this.lastFrame ? Math.min(64, time - this.lastFrame) : 16;
    this.lastFrame = time;

    if (this.animation) {
      var a = this.animation;
      var t = Math.min(1, (time - a.start) / a.duration);
      var ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.lambda = a.fromLambda + (a.toLambda - a.fromLambda) * ease;
      this.phi = a.fromPhi + (a.toPhi - a.fromPhi) * ease;
      this.zoom = a.fromZoom + (a.toZoom - a.fromZoom) * ease;
      if (t >= 1) this.animation = null;
    } else if (!this.drag && (Math.abs(this.velocity.x) > 0.001 || Math.abs(this.velocity.y) > 0.001)) {
      this.lambda += this.velocity.x;
      this.phi = Math.max(-70, Math.min(70, this.phi + this.velocity.y));
      this.velocity.x *= 0.92;
      this.velocity.y *= 0.92;
    } else if (!this.drag && time > this.idleUntil && this.spinSpeed) {
      this.lambda += this.spinSpeed / this.zoom * dt / 1000;
    }
    if (this.zoom !== this.reportedZoom) {
      this.reportedZoom = this.zoom;
      if (this.options.onZoom) this.options.onZoom(this.zoom);
    }
    this.draw(time);
    requestAnimationFrame(this.frame);
  };

  CwpGlobe.prototype.draw = function (time) {
    var ctx = this.ctx;
    var dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    var cx = this.width / 2;
    var cy = this.height / 2;
    var r = this.radius();

    // Sphere: a soft halo, then the disc.
    var halo = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.12);
    halo.addColorStop(0, 'rgba(69, 29, 199, 0.10)');
    halo.addColorStop(1, 'rgba(69, 29, 199, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fill();
    var sphere = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
    sphere.addColorStop(0, '#FFFFFF');
    sphere.addColorStop(1, '#EEEBF8');
    ctx.fillStyle = sphere;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(69, 29, 199, 0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    this.drawGraticule(ctx, r);
    this.drawLand(ctx, r);
    this.drawArcs(ctx, time);
    this.drawMarkers(ctx, time);
  };

  CwpGlobe.prototype.drawGraticule = function (ctx) {
    ctx.strokeStyle = 'rgba(69, 29, 199, 0.06)';
    ctx.lineWidth = 1;
    for (var lat = -60; lat <= 60; lat += 30) this.strokeLine(ctx, lat, null);
    for (var lon = -180; lon < 180; lon += 30) this.strokeLine(ctx, null, lon);
  };

  CwpGlobe.prototype.strokeLine = function (ctx, lat, lon) {
    ctx.beginPath();
    var drawing = false;
    for (var step = 0; step <= 72; step++) {
      var p = lat !== null ? this.project(lat, -180 + step * 5) : this.project(-90 + step * 2.5, lon);
      if (p.z > 0) {
        if (drawing) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
        drawing = true;
      } else {
        drawing = false;
      }
    }
    ctx.stroke();
  };

  CwpGlobe.prototype.drawLand = function (ctx, r) {
    var land = this.land;
    if (!land || !land.count) return;
    var cx = this.width / 2;
    var cy = this.height / 2;
    var lambda = this.lambda * DEG;
    var ph = this.phi * DEG;
    var sinPh = Math.sin(ph);
    var cosPh = Math.cos(ph);
    var size = Math.max(1.1, Math.min(3.6, r / 150));
    var half = size / 2;
    // Three depth buckets give a limb-darkened look with only three fills.
    var buckets = [[], [], []];
    for (var i = 0; i < land.count; i++) {
      var lo = land.lon[i] + lambda;
      var cosLo = Math.cos(lo);
      var z = sinPh * land.sinLat[i] + cosPh * land.cosLat[i] * cosLo;
      if (z <= 0.02) continue;
      var x = cx + r * land.cosLat[i] * Math.sin(lo);
      var y = cy - r * (cosPh * land.sinLat[i] - sinPh * land.cosLat[i] * cosLo);
      buckets[z > 0.55 ? 0 : (z > 0.25 ? 1 : 2)].push(x - half, y - half);
    }
    var colors = ['rgba(69, 29, 199, 0.42)', 'rgba(69, 29, 199, 0.28)', 'rgba(69, 29, 199, 0.15)'];
    for (var b = 0; b < 3; b++) {
      var list = buckets[b];
      ctx.fillStyle = colors[b];
      ctx.beginPath();
      for (var j = 0; j < list.length; j += 2) ctx.rect(list[j], list[j + 1], size, size);
      ctx.fill();
    }
  };

  CwpGlobe.prototype.drawArcs = function (ctx, time) {
    if (!this.arcs.length) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(69, 29, 199, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 4]);
    ctx.lineDashOffset = -((time / 60) % 9);
    for (var i = 0; i < this.arcs.length; i++) {
      var arc = this.arcs[i];
      var a = toVector(arc.from.lat, arc.from.lon);
      var b = toVector(arc.to.lat, arc.to.lon);
      var omega = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
      if (omega < 0.001) continue;
      ctx.beginPath();
      var drawing = false;
      for (var s = 0; s <= 48; s++) {
        var t = s / 48;
        var k1 = Math.sin((1 - t) * omega) / Math.sin(omega);
        var k2 = Math.sin(t * omega) / Math.sin(omega);
        var v = [k1 * a[0] + k2 * b[0], k1 * a[1] + k2 * b[1], k1 * a[2] + k2 * b[2]];
        var lat = Math.asin(Math.max(-1, Math.min(1, v[2]))) / DEG;
        var lon = Math.atan2(v[1], v[0]) / DEG;
        var p = this.project(lat, lon);
        if (p.z > 0) {
          if (drawing) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          drawing = true;
        } else {
          drawing = false;
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  CwpGlobe.prototype.drawMarkers = function (ctx, time) {
    var projected = [];
    var highlight = this.highlight;
    for (var i = 0; i < this.clusters.length; i++) {
      var cluster = this.clusters[i];
      var p = this.project(cluster.lat, cluster.lon);
      if (p.z <= 0.05) continue;
      var radius = Math.min(13, 3.6 + 2.1 * Math.sqrt(cluster.count));
      projected.push({ x: p.x, y: p.y, z: p.z, r: radius, cluster: cluster });
    }
    projected.sort(function (a, b) { return a.z - b.z; });
    for (var j = 0; j < projected.length; j++) {
      var item = projected[j];
      var c = item.cluster;
      var dimmed = highlight && !highlight.has(c.key);
      var active = (highlight && highlight.has(c.key)) || c === this.hover;
      var alpha = dimmed ? 0.22 : Math.min(1, 0.45 + item.z);
      var color = ROLE_COLORS[c.role] || ROLE_COLORS.other;
      if (c.fresh && !dimmed) {
        var phase = (time / 1600 + c.seed) % 1;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.r + 2 + phase * 14, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(color, 0.45 * (1 - phase));
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.r + (active ? 2 : 0), 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(color, alpha * 0.9);
      ctx.fill();
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.strokeStyle = active ? '#16121F' : 'rgba(255, 255, 255, ' + alpha + ')';
      ctx.stroke();
      if (c.count > 1 && item.r >= 7 && !dimmed) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 ' + Math.round(item.r * 0.95) + 'px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(c.count), item.x, item.y + 0.5);
      }
    }
    this.projected = projected;
  };

  CwpGlobe.prototype.destroy = function () {
    this.destroyed = true;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    else window.removeEventListener('resize', this.onResize);
  };

  function toVector(lat, lon) {
    var la = lat * DEG;
    var lo = lon * DEG;
    return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
  }

  function hexToRgba(hex, alpha) {
    var value = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((value >> 16) & 255) + ', ' + ((value >> 8) & 255) + ', ' + (value & 255) + ', ' + alpha + ')';
  }

  window.CwpGlobe = CwpGlobe;
})();
