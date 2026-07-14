// This file is loaded via @require - users never see this code
window.__speedHackInit = function() {

    // ===== HIDDEN CONFIG =====
    var _x1='68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d'; // https://raw.githubusercontent.com
    var _x2='2f7564656d6f323131362d6e6574697a656e2f66616868682f6d61696e2f636f6e666967332e6a736f6e'; // /udemo2116-netizen/fahhh/main/config3.json
    
    function _d(h){var r='';for(var i=0;i<h.length;i+=2)r+=String.fromCharCode(parseInt(h.substr(i,2),16));return r;}
    var _URL=_d(_x1)+_d(_x2);

    // ===== FETCH PASSWORD =====
    function fetchPassword() {
        return new Promise(function(ok, fail) {
            GM_xmlhttpRequest({
                method: 'GET', url: _URL, timeout: 10000,
                headers: {'Cache-Control': 'no-cache'},
                onload: function(r) {
                    if (r.status === 200) {
                        try {
                            var j = JSON.parse(r.responseText);
                            var pw = j.config3 ? j.config3.password : (j.password || null);
                            if (pw) ok(pw);
                            else fail(new Error('No password'));
                        } catch(e) { fail(e); }
                    } else { fail(new Error('HTTP ' + r.status)); }
                },
                onerror: function() { fail(new Error('Network error')); },
                ontimeout: function() { fail(new Error('Timeout')); }
            });
        });
    }

    var thePassword = null;
    var authed = false;
    var speed = 1;
    var settings = {
        perfNow: false, dateNow: false, setTimeout: false, setInterval: false,
        raf: false, music: false, sfx: false,
        perfNowSpeed: 1, dateNowSpeed: 1, setTimeoutSpeed: 1,
        setIntervalSpeed: 1, rafSpeed: 1, musicSpeed: 1, sfxSpeed: 1,
        autoInjectFrames: true, hideKey: 'KeyL', debugLogging: false
    };
    var startTime = Date.now();

    // ===== NOTIFICATION =====
    function notify(msg, type, dur) {
        type = type || 'info'; dur = dur || 3000;
        var n = document.createElement('div');
        n.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);' +
            'background:' + (type === 'error' ? 'rgba(244,67,54,0.95)' :
            type === 'warning' ? 'rgba(255,193,7,0.95)' :
            type === 'success' ? 'rgba(76,175,80,0.95)' : 'rgba(33,150,243,0.95)') +
            ';color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;z-index:2147483649;' +
            'backdrop-filter:blur(15px);box-shadow:0 4px 20px rgba(0,0,0,0.3);max-width:400px;text-align:center;';
        n.innerHTML = (type === 'error' ? '❌ ' : type === 'warning' ? '⚠️ ' :
            type === 'success' ? '✅ ' : 'ℹ️ ') + msg;
        document.body.appendChild(n);
        var s = document.createElement('style');
        s.textContent = '@keyframes nF{from{opacity:0;transform:translateX(-50%) translateY(-30px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes nU{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(-30px)}}';
        document.head.appendChild(s);
        n.style.animation = 'nF 0.3s ease';
        setTimeout(function() {
            n.style.animation = 'nU 0.3s ease forwards';
            setTimeout(function() {
                if (document.body.contains(n)) document.body.removeChild(n);
                if (document.head.contains(s)) document.head.removeChild(s);
            }, 300);
        }, dur);
    }

    // ===== SPEED INJECTION =====
    function injectSpeed(s, st) {
        var code = '(function(){if(window.__shInjected)return;window.__shInjected=true;' +
            'var _s=' + JSON.stringify(st) + ';' +
            'var _oP=performance.now.bind(performance);' +
            'var _oD=Date.now;' +
            'var _oS=window.setTimeout.bind(window);' +
            'var _oI=window.setInterval.bind(window);' +
            'var _oR=window.requestAnimationFrame.bind(window);' +
            'var _pV=null,_pP=null,_pO=0;' +
            'var _dV=null,_dP=null,_dO=0;' +
            'var _rC=[],_rT=[];' +
            'performance.now=function(){var v=_oP();if(_pV===null){_pV=v;_pP=v;}' +
            'if(!_s.perfNow)return v+_pO;' +
            '_pV+=(v-_pP)*_s.perfNowSpeed;_pP=v;_pO=_pV-v;return _pV;};' +
            'Date.now=function(){var v=_oD();if(_dV===null){_dV=v;_dP=v;}' +
            'if(!_s.dateNow)return v+_dO;' +
            '_dV+=(v-_dP)*_s.dateNowSpeed;_dP=v;_dO=_dV-v;return Math.floor(_dV);};' +
            'window.setTimeout=function(cb,dl){if(typeof cb!=="function")return _oS(cb,dl);' +
            'return _oS(cb,_s.setTimeout?Math.max(0,dl/_s.setTimeoutSpeed):dl);};' +
            'window.setInterval=function(cb,dl){if(typeof cb!=="function")return _oI(cb,dl);' +
            'return _oI(cb,_s.setInterval?Math.max(1,dl/_s.setIntervalSpeed):dl);};' +
            'window.requestAnimationFrame=function(cb){return _oR(function(t){' +
            'var i=_rC.indexOf(cb);if(i===-1){_rC.push(cb);_rT.push(0);cb(t);}' +
            'else if(_s.raf){_rT[i]+=_s.rafSpeed;while(_rT[i]>=1){cb(t);_rT[i]-=1;}}' +
            'else{cb(t);}});};' +
            'window.__shUpdate=function(s2,st2){_s=st2;};' +
            '})();';
        var el = document.createElement('script');
        el.textContent = code;
        (document.head || document.documentElement).appendChild(el);
    }

    function injectAll() {
        injectSpeed(speed, settings);
        if (settings.autoInjectFrames) {
            var frames = document.querySelectorAll('iframe');
            for (var i = 0; i < frames.length; i++) {
                try { injectSpeed(speed, settings); } catch(e) {}
            }
        }
    }

    // ===== AUDIO HOOK =====
    (function() {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        var srcMap = new Map();
        var origAC = AC;
        window.AudioContext = window.webkitAudioContext = function() {
            var ctx = new origAC();
            var origCBS = ctx.createBufferSource.bind(ctx);
            ctx.createBufferSource = function() {
                var src = origCBS();
                srcMap.set(src, false);
                var loopDesc = Object.getOwnPropertyDescriptor(AudioBufferSourceNode.prototype, 'loop');
                Object.defineProperty(src, 'loop', {
                    get: function() { return this._loop || false; },
                    set: function(v) {
                        this._loop = v;
                        if (loopDesc && loopDesc.set) loopDesc.set.call(src, v);
                        srcMap.set(src, v === true);
                    }
                });
                return src;
            };
            return ctx;
        };
        setInterval(function() {
            srcMap.forEach(function(isMusic, src) {
                try {
                    if (!src.playbackRate) return;
                    if (isMusic && settings.music) src.playbackRate.value = settings.musicSpeed;
                    else if (!isMusic && settings.sfx) src.playbackRate.value = settings.sfxSpeed;
                    else src.playbackRate.value = 1;
                } catch(e) { srcMap.delete(src); }
            });
        }, 100);
    })();

    // ===== PASSWORD PANEL =====
    function showPasswordPanel() {
        var existing = document.getElementById('__shPwd');
        if (existing) existing.remove();

        var style = document.createElement('style');
        style.id = '__shStyles';
        style.textContent = '' +
            '#__shPwd{position:fixed;z-index:2147483647;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;' +
            'font-family:Arial,sans-serif;backdrop-filter:blur(5px)}' +
            '#__shBox{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);padding:35px 30px;' +
            'border-radius:15px;box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 100px rgba(0,255,136,0.1);' +
            'border:1px solid rgba(0,255,136,0.2);text-align:center;min-width:330px;max-width:400px;' +
            'animation:aF 0.3s ease}' +
            '@keyframes aF{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}' +
            '@keyframes aS{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}' +
            '20%,40%,60%,80%{transform:translateX(5px)}}' +
            '#__shBox h2{color:#00ff88;margin:0 0 5px;font-size:22px;font-weight:700;' +
            'text-shadow:0 0 10px rgba(0,255,136,0.5)}' +
            '#__shBox .sub{color:#aaa;font-size:13px;margin:0 0 18px}' +
            '#__shSt{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;' +
            'margin:12px 0;background:rgba(0,0,0,0.3);border-radius:8px;font-size:13px}' +
            '#__shSt .dot{width:8px;height:8px;border-radius:50%;display:inline-block}' +
            '#__shSt .dot.l{background:#ffaa00;animation:shP 1.5s infinite}' +
            '#__shSt .dot.ok{background:#00ff88;box-shadow:0 0 10px rgba(0,255,136,0.5)}' +
            '#__shSt .dot.e{background:#ff4444;box-shadow:0 0 10px rgba(255,68,68,0.5)}' +
            '@keyframes shP{0%,100%{opacity:1}50%{opacity:0.3}}' +
            '#__shInp{width:100%;padding:12px 15px;margin:10px 0;border:2px solid #333;border-radius:8px;' +
            'background:rgba(0,0,0,0.3);color:#fff;font-size:16px;box-sizing:border-box;outline:none;' +
            'transition:all 0.3s}' +
            '#__shInp:focus{border-color:#00ff88;box-shadow:0 0 10px rgba(0,255,136,0.2)}' +
            '#__shInp:disabled{opacity:0.5;cursor:not-allowed}' +
            '#__shErr{color:#ff4444;font-size:13px;margin:8px 0;min-height:20px;font-weight:500}' +
            '#__shBtn{width:100%;padding:12px;margin:5px 0;background:linear-gradient(135deg,#00ff88,#00cc6a);' +
            'border:none;border-radius:8px;color:#0f0c29;font-size:16px;font-weight:700;cursor:pointer;' +
            'transition:all 0.3s;text-transform:uppercase;letter-spacing:1px}' +
            '#__shBtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 5px 20px rgba(0,255,136,0.4)}' +
            '#__shBtn:disabled{background:#555;cursor:not-allowed}' +
            '#__shCancel{width:100%;padding:10px;margin:5px 0;background:rgba(255,255,255,0.1);' +
            'border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#ccc;font-size:14px;cursor:pointer;' +
            'transition:all 0.3s}' +
            '#__shCancel:hover{background:rgba(255,255,255,0.15)}';
        document.head.appendChild(style);

        var overlay = document.createElement('div');
        overlay.id = '__shPwd';
        overlay.innerHTML = '' +
            '<div id="__shBox">' +
            '<h2>🔒 Speed Hack</h2>' +
            '<p class="sub">Remote Authentication Required</p>' +
            '<div id="__shSt"><span class="dot l" id="__dot"></span><span id="__txt">Connecting to server...</span></div>' +
            '<input type="password" id="__shInp" placeholder="Enter password" autocomplete="off" disabled>' +
            '<div id="__shErr"></div>' +
            '<button id="__shBtn" disabled>Unlock</button>' +
            '<button id="__shCancel">Cancel</button></div>';
        document.body.appendChild(overlay);

        var dot = document.getElementById('__dot');
        var txt = document.getElementById('__txt');
        var inp = document.getElementById('__shInp');
        var btn = document.getElementById('__shBtn');
        var cancel = document.getElementById('__shCancel');
        var err = document.getElementById('__shErr');
        var box = document.getElementById('__shBox');

        function shake() {
            box.style.animation = 'none';
            box.offsetHeight;
            box.style.animation = 'aS 0.5s ease';
            setTimeout(function() { box.style.animation = ''; }, 500);
        }

        // Fetch password
        fetchPassword().then(function(pw) {
            thePassword = pw;
            dot.className = 'dot ok';
            txt.textContent = '✅ Connected';
            inp.disabled = false;
            btn.disabled = false;
            inp.focus();
        }).catch(function(e) {
            dot.className = 'dot e';
            txt.textContent = '❌ Failed to connect';
            err.textContent = 'Server unreachable. Try again later.';
        });

        function submit() {
            if (!thePassword) { err.textContent = 'Still connecting...'; return; }
            if (inp.value === thePassword) {
                authed = true;
                try { GM_setValue('__shAuth', JSON.stringify({ ok: true, ts: Date.now() })); } catch(e) {}
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s';
                setTimeout(function() {
                    overlay.remove();
                    createUI();
                }, 300);
            } else {
                err.textContent = '❌ Wrong password';
                inp.value = '';
                inp.focus();
                shake();
            }
        }

        btn.addEventListener('click', submit);
        inp.addEventListener('keypress', function(e) { if (e.key === 'Enter') submit(); });
        cancel.addEventListener('click', function() {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s';
            setTimeout(function() { overlay.remove(); }, 300);
        });
    }

    // ===== FORMAT =====
    function fmt(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        if (num >= 1) return num.toFixed(3).replace(/\.?0+$/, '');
        return num.toFixed(6).replace(/\.?0+$/, '');
    }

    // ===== MAIN UI =====
    var ui = null;
    var hidden = false;

    function createUI() {
        if (ui) return;
        var existing = document.getElementById('__shUI');
        if (existing) existing.remove();

        ui = document.createElement('div');
        ui.id = '__shUI';
        ui.style.cssText = 'position:fixed;top:10px;right:10px;padding:16px;background:linear-gradient(135deg,rgba(0,0,0,0.96),rgba(30,30,30,0.96));color:#fff;z-index:2147483646;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:13px;min-width:290px;max-width:340px;box-shadow:0 12px 40px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(25px);user-select:none;transition:all 0.4s;max-height:90vh;overflow-y:auto;box-sizing:border-box;';

        var presets = [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100];
        var extreme = [{ v: 1000, l: '1000x', c: '#E91E63' }, { v: 10000, l: '10K x', c: '#9C27B0' },
            { v: 100000, l: '100K x', c: '#F44336' }, { v: 1000000, l: '1M x', c: '#FF5722' }];
        var funcs = [
            ['pn', 'performance.now()'], ['dn', 'Date.now()'], ['st', 'setTimeout'],
            ['si', 'setInterval'], ['rf', 'requestAnimationFrame'], ['mu', '🎵 Music'], ['sf', '🔊 SFX']
        ];
        var funcKeys = ['perfNowSpeed', 'dateNowSpeed', 'setTimeoutSpeed',
            'setIntervalSpeed', 'rafSpeed', 'musicSpeed', 'sfxSpeed'];
        var toggleKeys = ['perfNow', 'dateNow', 'setTimeout', 'setInterval', 'raf', 'music', 'sfx'];

        var html = '' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<div><strong style="color:#4CAF50;font-size:14px;">⚡ Speed Hack</strong>' +
            '<div style="font-size:9px;color:#888;">Press <span style="color:#4CAF50;">' + settings.hideKey.replace('KeyL', 'L') + '</span> to hide</div>' +
            '<div style="font-size:9px;color:#888;" id="__date"></div></div>' +
            '<div style="display:flex;gap:6px;">' +
            '<button id="__lockBtn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:13px;padding:5px 8px;border-radius:5px;">🔒</button>' +
            '<button id="__cfgBtn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:13px;padding:5px 8px;border-radius:5px;">⚙️</button>' +
            '<button id="__minBtn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:13px;padding:5px 8px;border-radius:5px;">−</button></div></div>' +
            '<div id="__mainC">';

        // Toggles
        html += '<div style="margin-bottom:10px;"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
        for (var i = 0; i < funcs.length; i++) {
            html += '<label style="display:flex;align-items:center;cursor:pointer;padding:4px 6px;border-radius:5px;background:rgba(255,255,255,0.04);' +
                (funcs[i][0] === 'rf' ? 'grid-column:span 2;' : '') + '">' +
                '<input type="checkbox" id="__chk-' + funcs[i][0] + '" style="margin-right:6px;accent-color:#4CAF50;">' +
                funcs[i][1] + '</label>';
        }
        html += '</div></div><hr style="border:none;border-top:1px solid rgba(255,255,255,0.2);margin:10px 0;">';

        // Speed slider
        html += '<div style="margin-bottom:10px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
            '<span style="font-weight:600;">Speed:</span>' +
            '<span id="__spdDisp" style="color:#4CAF50;font-weight:bold;font-size:15px;">1x</span></div>' +
            '<div style="display:flex;gap:8px;margin-bottom:6px;">' +
            '<input type="number" id="__spdInp" value="1" step="any" style="flex:1;padding:7px 10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;font-size:13px;">' +
            '<button id="__applyBtn" style="padding:7px 14px;background:linear-gradient(135deg,#4CAF50,#45a049);border:none;color:#fff;border-radius:6px;cursor:pointer;font-weight:600;">Apply</button></div>' +
            '<input type="range" id="__spdSlider" min="0" max="100" value="0" step="0.1" style="width:100%;accent-color:#4CAF50;height:5px;">' +
            '</div>';

        // Presets
        html += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-bottom:8px;">';
        for (var i = 0; i < presets.length; i++) {
            var v = presets[i];
            html += '<button class="__prBtn" data-v="' + v + '" style="padding:5px 3px;font-size:10px;background:' +
                (v === 1 ? '#4CAF50' : '#333') + ';border:1px solid ' + (v === 1 ? '#4CAF50' : '#555') +
                ';color:#fff;border-radius:5px;cursor:pointer;font-weight:600;">' + fmt(v) + 'x</button>';
        }
        html += '</div>';

        // Extreme
        html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:3px;margin-bottom:8px;">';
        for (var i = 0; i < extreme.length; i++) {
            var e = extreme[i];
            html += '<button class="__prBtn" data-v="' + e.v + '" style="padding:5px 3px;font-size:9px;background:linear-gradient(135deg,' + e.c + ',' + e.c + ');border:1px solid ' + e.c + ';color:#fff;border-radius:5px;cursor:pointer;font-weight:600;">' + e.l + '</button>';
        }
        html += '</div>';

        // Action buttons
        html += '<div style="display:flex;gap:5px;margin-bottom:8px;">' +
            '<button id="__saveBtn" style="flex:1;padding:7px;font-size:11px;background:linear-gradient(135deg,rgba(255,193,7,0.9),rgba(255,152,0,0.9));border:1px solid #FFC107;color:#000;border-radius:6px;cursor:pointer;font-weight:600;">💾 Save</button>' +
            '<button id="__resetBtn" style="flex:1;padding:7px;font-size:11px;background:linear-gradient(135deg,rgba(244,67,54,0.9),rgba(211,47,47,0.9));border:1px solid #F44336;color:#fff;border-radius:6px;cursor:pointer;font-weight:600;">🔄 Reset</button>' +
            '<button id="__maxBtn" style="flex:1;padding:7px;font-size:11px;background:linear-gradient(135deg,rgba(156,39,176,0.9),rgba(123,31,162,0.9));border:1px solid #9C27B0;color:#fff;border-radius:6px;cursor:pointer;font-weight:600;">∞ Max</button></div>';

        // Stats
        html += '<div style="font-size:11px;color:#ccc;text-align:center;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;">' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span>Active:</span><span id="__activeCnt" style="color:#4CAF50;font-weight:600;">0</span></div>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span>Uptime:</span><span id="__uptime" style="color:#2196F3;font-weight:600;">0s</span></div>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span>Time:</span><span id="__time" style="color:#FFC107;font-weight:600;">--:--:--</span></div>' +
            '<div style="display:flex;justify-content:space-between;"><span>Status:</span><span id="__status" style="color:#4CAF50;font-weight:600;">Ready</span></div></div></div>';

        // Config panel (hidden by default)
        html += '<div id="__cfgPanel" style="display:none;margin-top:10px;padding:12px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.12);">' +
            '<div style="font-weight:600;margin-bottom:8px;color:#4CAF50;font-size:12px;">⚙️ Advanced</div>';

        for (var i = 0; i < funcs.length; i++) {
            html += '<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">' +
                '<span style="font-size:11px;color:#ccc;">' + funcs[i][1] + '</span>' +
                '<span id="__spdVal-' + funcs[i][0] + '" style="color:#4CAF50;font-weight:600;font-size:11px;">1x</span></div>' +
                '<input type="range" id="__sl-' + funcs[i][0] + '" min="0" max="100" value="0" step="0.1" style="width:100%;accent-color:#4CAF50;height:4px;"></div>';
        }

        html += '<div style="display:flex;gap:5px;margin-top:8px;">' +
            '<button id="__syncBtn" style="flex:1;padding:6px;background:rgba(76,175,80,0.2);border:1px solid #4CAF50;color:#4CAF50;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;">🔗 Sync</button>' +
            '<button id="__resetAllBtn" style="flex:1;padding:6px;background:rgba(244,67,54,0.2);border:1px solid #F44336;color:#F44336;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;">🔄 Reset</button></div>' +
            '<label style="display:flex;align-items:center;margin:6px 0;cursor:pointer;font-size:11px;">' +
            '<input type="checkbox" id="__chkAutoFrames" checked style="margin-right:5px;accent-color:#4CAF50;"> Auto inject iframes</label>' +
            '<label style="display:flex;align-items:center;margin-bottom:6px;cursor:pointer;font-size:11px;">' +
            '<input type="checkbox" id="__chkDebug" style="margin-right:5px;accent-color:#4CAF50;"> Debug logs</label>' +
            '<div style="margin:8px 0;padding:8px;background:rgba(33,150,243,0.1);border:1px solid rgba(33,150,243,0.2);border-radius:6px;">' +
            '<div style="font-size:10px;color:#64B5F6;font-weight:600;margin-bottom:4px;">⏱ Time Reset</div>' +
            '<button id="__resetTimeBtn" style="width:100%;padding:6px;background:linear-gradient(135deg,rgba(33,150,243,0.2),rgba(25,118,210,0.2));border:1px solid #2196F3;color:#2196F3;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">🔄 Reset Time Functions</button></div>' +
            '<div style="display:flex;gap:5px;">' +
            '<button id="__clearBtn" style="flex:1;padding:6px;background:rgba(244,67,54,0.2);border:1px solid #F44336;color:#F44336;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">Clear All</button>' +
            '<button id="__refreshBtn" style="flex:1;padding:6px;background:rgba(76,175,80,0.2);border:1px solid #4CAF50;color:#4CAF50;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">🔄 Refresh</button></div></div>';

        ui.innerHTML = html;
        document.body.appendChild(ui);

        // Get elements
        var spdSlider = document.getElementById('__spdSlider');
        var spdDisp = document.getElementById('__spdDisp');
        var spdInp = document.getElementById('__spdInp');
        var applyBtn = document.getElementById('__applyBtn');

        // Set initial values
        for (var i = 0; i < toggleKeys.length; i++) {
            var cb = document.getElementById('__chk-' + funcs[i][0]);
            if (cb) cb.checked = settings[toggleKeys[i]];
        }
        document.getElementById('__chkAutoFrames').checked = settings.autoInjectFrames;
        document.getElementById('__chkDebug').checked = settings.debugLogging;

        spdSlider.value = Math.min(100, Math.max(0, speed < 1 ? speed * 100 : speed));
        spdDisp.textContent = fmt(speed) + 'x';
        spdInp.value = speed;

        // Update func sliders
        function updateFuncSliders() {
            for (var i = 0; i < funcs.length; i++) {
                var sl = document.getElementById('__sl-' + funcs[i][0]);
                var vd = document.getElementById('__spdVal-' + funcs[i][0]);
                if (sl) {
                    sl.disabled = !settings[toggleKeys[i]];
                    sl.style.opacity = settings[toggleKeys[i]] ? '1' : '0.3';
                }
            }
        }
        updateFuncSliders();

        // Highlight active preset
        function highlightPreset() {
            var btns = document.querySelectorAll('.__prBtn');
            for (var i = 0; i < btns.length; i++) {
                var v = parseFloat(btns[i].dataset.v);
                if (Math.abs(v - speed) < 0.001) {
                    btns[i].style.background = 'linear-gradient(135deg,#4CAF50,#45a049)';
                    btns[i].style.boxShadow = '0 0 8px rgba(76,175,80,0.5)';
                } else {
                    btns[i].style.boxShadow = 'none';
                }
            }
        }
        highlightPreset();

        // Speed slider
        spdSlider.addEventListener('input', function() {
            speed = Math.round((spdSlider.value / 100) * 1000) / 1000;
            if (speed < 0.001) speed = 0.001;
            spdDisp.textContent = fmt(speed) + 'x';
            spdInp.value = speed;
            syncAllSpeeds();
            injectAll();
            saveSettings();
            highlightPreset();
        });

        // Apply button
        function applySpeed() {
            var v = parseFloat(spdInp.value);
            if (isNaN(v) || v <= 0) { spdInp.value = speed; return; }
            speed = v;
            syncAllSpeeds();
            spdSlider.value = Math.max(0, Math.min(100, speed * 100));
            spdDisp.textContent = fmt(speed) + 'x';
            injectAll();
            saveSettings();
            highlightPreset();
        }
        applyBtn.addEventListener('click', applySpeed);
        spdInp.addEventListener('keypress', function(e) { if (e.key === 'Enter') { applySpeed(); spdInp.blur(); } });

        // Presets
        var prBtns = document.querySelectorAll('.__prBtn');
        for (var i = 0; i < prBtns.length; i++) {
            prBtns[i].addEventListener('click', function() {
                speed = parseFloat(this.dataset.v);
                syncAllSpeeds();
                spdSlider.value = Math.max(0, Math.min(100, speed * 100));
                spdDisp.textContent = fmt(speed) + 'x';
                spdInp.value = speed;
                injectAll();
                saveSettings();
                highlightPreset();
            });
        }

        // Toggles
        for (var i = 0; i < toggleKeys.length; i++) {
            (function(idx) {
                document.getElementById('__chk-' + funcs[idx][0]).addEventListener('change', function() {
                    settings[toggleKeys[idx]] = this.checked;
                    updateFuncSliders();
                    injectAll();
                    saveSettings();
                });
            })(i);
        }

        // Auto frames / debug
        document.getElementById('__chkAutoFrames').addEventListener('change', function() {
            settings.autoInjectFrames = this.checked; saveSettings();
        });
        document.getElementById('__chkDebug').addEventListener('change', function() {
            settings.debugLogging = this.checked; saveSettings();
        });

        // Func sliders
        for (var i = 0; i < funcs.length; i++) {
            (function(idx) {
                var sl = document.getElementById('__sl-' + funcs[idx][0]);
                sl.value = settings[funcKeys[idx]] * 100;
                var vd = document.getElementById('__spdVal-' + funcs[idx][0]);
                vd.textContent = fmt(settings[funcKeys[idx]]) + 'x';
                sl.addEventListener('input', function() {
                    var v = Math.round((sl.value / 100) * 1000) / 1000;
                    if (v < 0.001) v = 0.001;
                    settings[funcKeys[idx]] = v;
                    vd.textContent = fmt(v) + 'x';
                    injectAll();
                    saveSettings();
                });
            })(i);
        }

        // Sync/Reset buttons
        document.getElementById('__syncBtn').addEventListener('click', function() {
            syncAllSpeeds();
            for (var i = 0; i < funcs.length; i++) {
                var sl = document.getElementById('__sl-' + funcs[i][0]);
                var vd = document.getElementById('__spdVal-' + funcs[i][0]);
                sl.value = speed * 100;
                vd.textContent = fmt(speed) + 'x';
            }
            injectAll();
            saveSettings();
        });
        document.getElementById('__resetAllBtn').addEventListener('click', function() {
            for (var i = 0; i < funcKeys.length; i++) settings[funcKeys[i]] = 1;
            for (var i = 0; i < funcs.length; i++) {
                var sl = document.getElementById('__sl-' + funcs[i][0]);
                var vd = document.getElementById('__spdVal-' + funcs[i][0]);
                sl.value = 100;
                vd.textContent = '1x';
            }
            injectAll();
            saveSettings();
        });

        // Config toggle
        document.getElementById('__cfgBtn').addEventListener('click', function() {
            var p = document.getElementById('__cfgPanel');
            p.style.display = p.style.display === 'none' ? 'block' : 'none';
        });

        // Minimize
        document.getElementById('__minBtn').addEventListener('click', function() {
            var m = document.getElementById('__mainC');
            var p = document.getElementById('__cfgPanel');
            if (m.style.display === 'none') {
                m.style.display = 'block';
                this.textContent = '−';
            } else {
                m.style.display = 'none';
                p.style.display = 'none';
                this.textContent = '+';
            }
        });

        // Lock button
        document.getElementById('__lockBtn').addEventListener('click', function() {
            authed = false;
            try { GM_deleteValue('__shAuth'); } catch(e) {}
            ui.remove();
            ui = null;
            showPasswordPanel();
        });

        // Save/Reset/Max
        document.getElementById('__saveBtn').addEventListener('click', function() {
            var n = prompt('Save preset as:', fmt(speed) + 'x');
            if (n) { notify('Saved: ' + n, 'success'); }
        });
        document.getElementById('__resetBtn').addEventListener('click', function() {
            if (confirm('Reset to 1x?')) {
                speed = 1;
                syncAllSpeeds();
                spdSlider.value = 100;
                spdDisp.textContent = '1x';
                spdInp.value = 1;
                injectAll();
                saveSettings();
                highlightPreset();
            }
        });
        document.getElementById('__maxBtn').addEventListener('click', function() {
            if (confirm('MAX speed?')) {
                speed = 999999999;
                spdDisp.textContent = fmt(speed) + 'x';
                spdInp.value = speed;
                injectAll();
                saveSettings();
                highlightPreset();
            }
        });

        // Reset time
        document.getElementById('__resetTimeBtn').addEventListener('click', function() {
            if (confirm('Disable time functions?')) {
                settings.perfNow = false; settings.dateNow = false;
                settings.setTimeout = false; settings.setInterval = false; settings.raf = false;
                for (var i = 0; i < 5; i++) document.getElementById('__chk-' + funcs[i][0]).checked = false;
                updateFuncSliders();
                injectAll();
                saveSettings();
            }
        });

        // Clear/Refresh
        document.getElementById('__clearBtn').addEventListener('click', function() {
            if (confirm('Clear ALL settings?')) {
                localStorage.removeItem('__shSettings');
                setTimeout(function() { location.reload(); }, 500);
            }
        });
        document.getElementById('__refreshBtn').addEventListener('click', function() { location.reload(); });

        // Stats update
        setInterval(function() {
            var count = 0;
            for (var i = 0; i < toggleKeys.length; i++) if (settings[toggleKeys[i]]) count++;
            var now = new Date();
            var up = Math.floor((Date.now() - startTime) / 1000);
            var cntEl = document.getElementById('__activeCnt');
            var timeEl = document.getElementById('__time');
            var dateEl = document.getElementById('__date');
            var upEl = document.getElementById('__uptime');
            var statusEl = document.getElementById('__status');
            if (cntEl) cntEl.textContent = count;
            if (statusEl) { statusEl.textContent = count > 0 ? 'Active' : 'Ready'; statusEl.style.color = count > 0 ? '#4CAF50' : '#2196F3'; }
            if (timeEl) timeEl.textContent = now.toLocaleTimeString();
            if (dateEl) dateEl.textContent = '📅 ' + now.toLocaleDateString();
            if (upEl) {
                if (up < 60) upEl.textContent = up + 's';
                else if (up < 3600) upEl.textContent = Math.floor(up / 60) + 'm ' + (up % 60) + 's';
                else upEl.textContent = Math.floor(up / 3600) + 'h ' + Math.floor((up % 3600) / 60) + 'm';
            }
        }, 1000);

        // Draggable
        var dragging = false, dragOffset = { x: 0, y: 0 };
        ui.addEventListener('mousedown', function(e) {
            if (!e.target.matches('input,button,label')) {
                dragging = true;
                dragOffset.x = e.clientX - ui.offsetLeft;
                dragOffset.y = e.clientY - ui.offsetTop;
                ui.style.cursor = 'grabbing';
                ui.style.transition = 'none';
            }
        });
        document.addEventListener('mousemove', function(e) {
            if (dragging) {
                ui.style.left = Math.max(0, Math.min(window.innerWidth - ui.offsetWidth, e.clientX - dragOffset.x)) + 'px';
                ui.style.top = Math.max(0, Math.min(window.innerHeight - ui.offsetHeight, e.clientY - dragOffset.y)) + 'px';
                ui.style.right = 'auto';
                ui.style.bottom = 'auto';
            }
        });
        document.addEventListener('mouseup', function() {
            if (dragging) { dragging = false; ui.style.cursor = 'default'; ui.style.transition = 'all 0.4s'; }
        });

        // Toggle UI with L key
        document.addEventListener('keydown', function(e) {
            if (e.code === settings.hideKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
                e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                hidden = !hidden;
                ui.style.opacity = hidden ? '0' : '1';
                ui.style.pointerEvents = hidden ? 'none' : 'auto';
                ui.style.transform = hidden ? 'scale(0.95)' : 'scale(1)';
            }
        });

        // Init func slider values
        for (var i = 0; i < funcs.length; i++) {
            document.getElementById('__sl-' + funcs[i][0]).value = settings[funcKeys[i]] * 100;
            document.getElementById('__spdVal-' + funcs[i][0]).textContent = fmt(settings[funcKeys[i]]) + 'x';
        }
    }

    function syncAllSpeeds() {
        settings.perfNowSpeed = speed;
        settings.dateNowSpeed = speed;
        settings.setTimeoutSpeed = speed;
        settings.setIntervalSpeed = speed;
        settings.rafSpeed = speed;
        settings.musicSpeed = speed;
        settings.sfxSpeed = speed;
    }

    function saveSettings() {
        try {
            localStorage.setItem('__shSettings', JSON.stringify({ speed: speed, state: settings }));
        } catch(e) {}
    }

    function loadSettings() {
        try {
            var s = localStorage.getItem('__shSettings');
            if (s) {
                var o = JSON.parse(s);
                speed = o.speed || 1;
                if (o.state) Object.assign(settings, o.state);
            }
        } catch(e) {}
    }
    loadSettings();
    if (!localStorage.getItem('__shSettings')) { syncAllSpeeds(); saveSettings(); }

    // ===== START =====
    function init() {
        injectAll();
        createUI();

        if (settings.autoInjectFrames) {
            var obs = new MutationObserver(function(mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var added = mutations[i].addedNodes;
                    for (var j = 0; j < added.length; j++) {
                        if (added[j].nodeType === 1) {
                            var frames = added[j].tagName === 'IFRAME' ? [added[j]] : added[j].querySelectorAll('iframe');
                            for (var k = 0; k < frames.length; k++) {
                                frames[k].addEventListener('load', function() { setTimeout(injectAll, 100); });
                            }
                        }
                    }
                }
            });
            obs.observe(document, { childList: true, subtree: true });
        }
    }

    // Check saved auth
    try {
        var saved = GM_getValue('__shAuth');
        if (saved) {
            var auth = JSON.parse(saved);
            if (auth.ok && (Date.now() - auth.ts) < 86400000) {
                authed = true;
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', init);
                } else {
                    setTimeout(init, 100);
                }
                return;
            } else { GM_deleteValue('__shAuth'); }
        }
    } catch(e) {}

    // Show password panel
    if (document.body) { showPasswordPanel(); }
    else {
        var obs = new MutationObserver(function(mutations, observer) {
            if (document.body) { showPasswordPanel(); observer.disconnect(); }
        });
        obs.observe(document, { childList: true, subtree: true });
    }

    // Expose API
    window.SpeedHackPro = {
        getSpeed: function() { return speed; },
        setSpeed: function(v) { if (typeof v === 'number' && v > 0) { speed = v; injectAll(); saveSettings(); return true; } return false; },
        state: function() { return JSON.parse(JSON.stringify(settings)); },
        version: '1.0'
    };
};
