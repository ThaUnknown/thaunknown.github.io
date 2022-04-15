
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules\svelte-lookat\LookAt.svelte generated by Svelte v3.46.4 */

    const file$4 = "node_modules\\svelte-lookat\\LookAt.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*$$restProps*/ ctx[4], { style: /*style*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-1un0ijr", true);
    			add_location(div, file$4, 30, 0, 750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[10](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousemove", /*perspective*/ ctx[2], false, false, false),
    					listen_dev(div, "mouseleave", /*reset*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*style*/ 1) && { style: /*style*/ ctx[0] }
    			]));

    			toggle_class(div, "svelte-1un0ijr", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = ["intensity"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LookAt', slots, ['default']);
    	let x = 0;
    	let y = 0;
    	let style = '';
    	let container = null;
    	let { intensity = 1 } = $$props;

    	function perspective({ clientX, clientY }) {
    		let box = container.getBoundingClientRect();
    		$$invalidate(6, x = -(clientY - box.y - box.height / 2) / 2000 * intensity);
    		$$invalidate(7, y = (clientX - box.x - box.width / 2) / 2000 * intensity);
    	}

    	window.addEventListener(
    		'deviceorientation',
    		({ beta, gamma }) => {
    			if (beta && gamma) {
    				$$invalidate(6, x = (-beta + 80) / 40 * intensity);
    				$$invalidate(7, y = -gamma / 40 * intensity);
    			}
    		},
    		true
    	);

    	function reset() {
    		$$invalidate(6, x = 0);
    		$$invalidate(7, y = 0);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(1, container);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('intensity' in $$new_props) $$invalidate(5, intensity = $$new_props.intensity);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		x,
    		y,
    		style,
    		container,
    		intensity,
    		perspective,
    		reset
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('x' in $$props) $$invalidate(6, x = $$new_props.x);
    		if ('y' in $$props) $$invalidate(7, y = $$new_props.y);
    		if ('style' in $$props) $$invalidate(0, style = $$new_props.style);
    		if ('container' in $$props) $$invalidate(1, container = $$new_props.container);
    		if ('intensity' in $$props) $$invalidate(5, intensity = $$new_props.intensity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*x, y*/ 192) {
    			window.requestAnimationFrame(() => $$invalidate(0, style = `--transform: perspective(100px) rotateX(${x}deg) rotateY(${y}deg)`));
    		}
    	};

    	return [
    		style,
    		container,
    		perspective,
    		reset,
    		$$restProps,
    		intensity,
    		x,
    		y,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class LookAt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { intensity: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LookAt",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get intensity() {
    		throw new Error("<LookAt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set intensity(value) {
    		throw new Error("<LookAt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\modules\Splash.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\modules\\Splash.svelte";

    // (13:0) {#key current}
    function create_key_block(ctx) {
    	let div;
    	let t;
    	let div_intro;
    	let div_levels = [/*$$restProps*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*current*/ ctx[0]);
    			set_attributes(div, div_data);
    			add_location(div, file$3, 13, 2, 313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*current*/ 1) set_data_dev(t, /*current*/ ctx[0]);
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { y: 20, duration: 200 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(13:0) {#key current}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let previous_key = /*current*/ ctx[0];
    	let key_block_anchor;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*current*/ 1 && safe_not_equal(previous_key, previous_key = /*current*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			transition_in(key_block);
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["splash"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Splash', slots, []);
    	let { splash = ['Now with extra cookies!'] } = $$props;

    	function getRand() {
    		return splash[Math.floor(Math.random() * splash.length)];
    	}

    	let current = getRand();

    	setInterval(
    		() => {
    			$$invalidate(0, current = getRand());
    		},
    		2000
    	);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('splash' in $$new_props) $$invalidate(2, splash = $$new_props.splash);
    	};

    	$$self.$capture_state = () => ({ fly, splash, getRand, current });

    	$$self.$inject_state = $$new_props => {
    		if ('splash' in $$props) $$invalidate(2, splash = $$new_props.splash);
    		if ('current' in $$props) $$invalidate(0, current = $$new_props.current);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current, $$restProps, splash];
    }

    class Splash extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { splash: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Splash",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get splash() {
    		throw new Error("<Splash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splash(value) {
    		throw new Error("<Splash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\modules\LandingCard.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\modules\\LandingCard.svelte";

    // (26:0) <LookAt class="w-full h-full d-flex justify-content-center align-items-center" intensity="5">
    function create_default_slot(ctx) {
    	let div1;
    	let div0;
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let splash_1;
    	let current;

    	splash_1 = new Splash({
    			props: {
    				splash: /*splash*/ ctx[0],
    				class: "p-20 font-weight-bold font-size-24"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Hi, I'm";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "Cas";
    			t3 = space();
    			create_component(splash_1.$$.fragment);
    			attr_dev(h4, "class", "px-20 my-0 font-weight-bold");
    			add_location(h4, file$2, 28, 6, 928);
    			attr_dev(h1, "class", "px-20 my-0 font-weight-bold svelte-9g9wsd");
    			add_location(h1, file$2, 29, 6, 988);
    			attr_dev(div0, "class", "p-20 m-20");
    			add_location(div0, file$2, 27, 4, 897);
    			attr_dev(div1, "class", "welcome shadow-lg w-three-quarter h-three-quarter p-20 svelte-9g9wsd");
    			add_location(div1, file$2, 26, 2, 823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h4);
    			append_dev(div0, t1);
    			append_dev(div0, h1);
    			append_dev(div0, t3);
    			mount_component(splash_1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splash_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splash_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(splash_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(26:0) <LookAt class=\\\"w-full h-full d-flex justify-content-center align-items-center\\\" intensity=\\\"5\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t;
    	let lookat;
    	let current;

    	lookat = new LookAt({
    			props: {
    				class: "w-full h-full d-flex justify-content-center align-items-center",
    				intensity: "5",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			create_component(lookat.$$.fragment);
    			attr_dev(div, "class", "bg bg-very-dark svelte-9g9wsd");
    			add_location(div, file$2, 24, 0, 693);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(lookat, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const lookat_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				lookat_changes.$$scope = { dirty, ctx };
    			}

    			lookat.$set(lookat_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lookat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lookat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			destroy_component(lookat, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LandingCard', slots, []);

    	const splash = [
    		"I make browsers do what they aren't meant to",
    		'I write high-performance JS',
    		'I know P2P',
    		'I work with data streaming',
    		'I work with big data',
    		'I can use bitwise operators',
    		'I write regex from memory',
    		'I create the impossible',
    		'I envy knowledge',
    		'I never stop learning',
    		'I can optimise JS',
    		"I support experimental API's",
    		'I create cutting edge webapps',
    		'I utilise hardware acceleration',
    		'I know what the user wants',
    		'I prefer simplicity',
    		'I make webapps look native'
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LandingCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ LookAt, Splash, splash });
    	return [splash];
    }

    class LandingCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LandingCard",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\modules\Content.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$1 = "src\\modules\\Content.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i][0];
    	child_ctx[5] = list[i][1];
    	return child_ctx;
    }

    // (56:6) {#each Object.entries(icons) as [key, value]}
    function create_each_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/public/logos/" + /*value*/ ctx[5] + ".svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*key*/ ctx[4]);
    			attr_dev(img, "class", "w-100 h-100 p-20 svelte-9rhrx4");
    			add_location(img, file$1, 56, 8, 1949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:6) {#each Object.entries(icons) as [key, value]}",
    		ctx
    	});

    	return block;
    }

    // (87:4) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let div0;
    	let t3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Ooops!";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Looks like there's nothing here.";
    			t3 = space();
    			attr_dev(h2, "class", "font-weight-semi-bold mb-10");
    			add_location(h2, file$1, 88, 8, 4117);
    			add_location(div0, file$1, 89, 8, 4178);
    			attr_dev(div1, "class", "d-flex flex-column align-items-center justify-content-center text-center w-full");
    			add_location(div1, file$1, 87, 6, 4014);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(87:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:4) {#each repos as repo}
    function create_each_block(ctx) {
    	let div2;
    	let div1;
    	let h2;
    	let a;
    	let t0_value = /*repo*/ ctx[1].name + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let p;
    	let t2_value = (/*repo*/ ctx[1].description ?? 'No description provided.') + "";
    	let t2;
    	let t3;
    	let div0;
    	let span0;
    	let svg0;
    	let path0;
    	let t4;
    	let t5_value = /*repo*/ ctx[1].stargazers_count + "";
    	let t5;
    	let t6;
    	let span1;
    	let svg1;
    	let path1;
    	let t7;
    	let t8_value = /*repo*/ ctx[1].forks_count + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			span0 = element("span");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			span1 = element("span");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			attr_dev(a, "href", a_href_value = /*repo*/ ctx[1].html_url);
    			add_location(a, file$1, 66, 44, 2340);
    			attr_dev(h2, "class", "card-title pr-20 mb-0");
    			add_location(h2, file$1, 66, 10, 2306);
    			attr_dev(p, "class", "text-muted h-full mb-0");
    			add_location(p, file$1, 67, 10, 2396);
    			attr_dev(path0, "fill", "#FFFFFF99");
    			attr_dev(path0, "d", "M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z");
    			add_location(path0, file$1, 71, 16, 2657);
    			attr_dev(svg0, "viewBox", "0 0 576 512");
    			attr_dev(svg0, "class", "svelte-9rhrx4");
    			add_location(svg0, file$1, 70, 14, 2612);
    			attr_dev(span0, "class", "pr-5");
    			add_location(span0, file$1, 69, 12, 2577);
    			attr_dev(path1, "fill", "#FFFFFF99");
    			attr_dev(path1, "d", "M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z");
    			add_location(path1, file$1, 78, 16, 3141);
    			attr_dev(svg1, "viewBox", "0 0 384 512");
    			attr_dev(svg1, "class", "svelte-9rhrx4");
    			add_location(svg1, file$1, 77, 14, 3096);
    			attr_dev(span1, "class", "pr-5");
    			add_location(span1, file$1, 76, 12, 3061);
    			attr_dev(div0, "class", "d-flex flex-column position-absolute top-0 right-0 p-15");
    			add_location(div0, file$1, 68, 10, 2494);
    			attr_dev(div1, "class", "card m-10 d-flex flex-column position-relative svelte-9rhrx4");
    			add_location(div1, file$1, 65, 8, 2234);
    			attr_dev(div2, "class", "w-full col-lg-4");
    			add_location(div2, file$1, 64, 6, 2195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(h2, a);
    			append_dev(a, t0);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, svg0);
    			append_dev(svg0, path0);
    			append_dev(span0, t4);
    			append_dev(span0, t5);
    			append_dev(div0, t6);
    			append_dev(div0, span1);
    			append_dev(span1, svg1);
    			append_dev(svg1, path1);
    			append_dev(span1, t7);
    			append_dev(span1, t8);
    			append_dev(div2, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*repos*/ 1 && t0_value !== (t0_value = /*repo*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*repos*/ 1 && a_href_value !== (a_href_value = /*repo*/ ctx[1].html_url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*repos*/ 1 && t2_value !== (t2_value = (/*repo*/ ctx[1].description ?? 'No description provided.') + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*repos*/ 1 && t5_value !== (t5_value = /*repo*/ ctx[1].stargazers_count + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*repos*/ 1 && t8_value !== (t8_value = /*repo*/ ctx[1].forks_count + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(64:4) {#each repos as repo}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div10;
    	let div2;
    	let div0;
    	let h10;
    	let t1;
    	let div1;
    	let t2;
    	let b0;
    	let t4;
    	let b1;
    	let t6;
    	let b2;
    	let t7;
    	let span;
    	let t9;
    	let br0;
    	let br1;
    	let t10;
    	let b3;
    	let t12;
    	let b4;
    	let t14;
    	let b5;
    	let t16;
    	let b6;
    	let t18;
    	let hr0;
    	let t19;
    	let div5;
    	let div3;
    	let h11;
    	let t21;
    	let p;
    	let t23;
    	let div4;
    	let t24;
    	let hr1;
    	let t25;
    	let h12;
    	let t27;
    	let div6;
    	let t28;
    	let hr2;
    	let t29;
    	let div9;
    	let div7;
    	let h13;
    	let t31;
    	let div8;
    	let b7;
    	let t33;
    	let t34_value = decodeURIComponent(atob('Y2FzaXN0YWtlbiU0MGdtYWlsLmNvbQ==')) + "";
    	let t34;
    	let br2;
    	let t35;
    	let b8;
    	let t37;
    	let a;
    	let each_value_1 = Object.entries(icons);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*repos*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let each1_else = null;

    	if (!each_value.length) {
    		each1_else = create_else_block(ctx);
    	}

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "About me";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Hi, I'm ");
    			b0 = element("b");
    			b0.textContent = "Cas";
    			t4 = text(", but online I go as ");
    			b1 = element("b");
    			b1.textContent = "ThaUnknown_";
    			t6 = text(", as I don't reveal much information about myself and\r\n      ");
    			b2 = element("b");
    			t7 = text("take privacy ");
    			span = element("span");
    			span.textContent = "relatively";
    			t9 = text(" seriously.");
    			br0 = element("br");
    			br1 = element("br");
    			t10 = text("\r\n      I'm a ");
    			b3 = element("b");
    			b3.textContent = "self-taught";
    			t12 = text(" developer based in Europe. I specialize in ");
    			b4 = element("b");
    			b4.textContent = "fontend";
    			t14 = text(" development, handling and ");
    			b5 = element("b");
    			b5.textContent = "streaming";
    			t16 = text(" large amounts of data, and any new shiny\r\n      ");
    			b6 = element("b");
    			b6.textContent = "experimental API.";
    			t18 = space();
    			hr0 = element("hr");
    			t19 = space();
    			div5 = element("div");
    			div3 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Technologies";
    			t21 = space();
    			p = element("p");
    			p.textContent = "These are technologies I've used and am familiar with and more.";
    			t23 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t24 = space();
    			hr1 = element("hr");
    			t25 = space();
    			h12 = element("h1");
    			h12.textContent = "My Projects";
    			t27 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each1_else) {
    				each1_else.c();
    			}

    			t28 = space();
    			hr2 = element("hr");
    			t29 = space();
    			div9 = element("div");
    			div7 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Contact";
    			t31 = space();
    			div8 = element("div");
    			b7 = element("b");
    			b7.textContent = "Email:";
    			t33 = space();
    			t34 = text(t34_value);
    			br2 = element("br");
    			t35 = space();
    			b8 = element("b");
    			b8.textContent = "GitHub:";
    			t37 = space();
    			a = element("a");
    			a.textContent = "https://github.com/ThaUnknown";
    			attr_dev(h10, "class", "font-weight-bold");
    			add_location(h10, file$1, 39, 6, 998);
    			attr_dev(div0, "class", "col-md-4");
    			add_location(div0, file$1, 38, 4, 968);
    			add_location(b0, file$1, 42, 14, 1106);
    			add_location(b1, file$1, 42, 45, 1137);
    			attr_dev(span, "class", "font-size-12 font-weight-normal");
    			add_location(span, file$1, 43, 22, 1232);
    			add_location(b2, file$1, 43, 6, 1216);
    			add_location(br0, file$1, 43, 100, 1310);
    			add_location(br1, file$1, 43, 106, 1316);
    			add_location(b3, file$1, 44, 12, 1336);
    			add_location(b4, file$1, 44, 74, 1398);
    			add_location(b5, file$1, 44, 115, 1439);
    			add_location(b6, file$1, 45, 6, 1504);
    			attr_dev(div1, "class", "col-8 font-size-16");
    			add_location(div1, file$1, 41, 4, 1058);
    			attr_dev(div2, "class", "row py-20");
    			add_location(div2, file$1, 37, 2, 939);
    			attr_dev(hr0, "class", "my-20");
    			add_location(hr0, file$1, 48, 2, 1554);
    			attr_dev(h11, "class", "font-weight-bold");
    			add_location(h11, file$1, 51, 6, 1660);
    			add_location(p, file$1, 52, 6, 1714);
    			attr_dev(div3, "class", "col-md-4 order-md-last pl-md-20");
    			add_location(div3, file$1, 50, 4, 1607);
    			attr_dev(div4, "class", "col-md-8 font-size-16 justify-content-center d-flex flex-row flex-wrap");
    			add_location(div4, file$1, 54, 4, 1802);
    			attr_dev(div5, "class", "row py-20");
    			add_location(div5, file$1, 49, 2, 1578);
    			attr_dev(hr1, "class", "my-20");
    			add_location(hr1, file$1, 60, 2, 2064);
    			attr_dev(h12, "class", "font-weight-bold");
    			add_location(h12, file$1, 61, 2, 2088);
    			attr_dev(div6, "class", "row py-20");
    			add_location(div6, file$1, 62, 2, 2137);
    			attr_dev(hr2, "class", "my-20");
    			add_location(hr2, file$1, 93, 2, 4262);
    			attr_dev(h13, "class", "font-weight-bold");
    			add_location(h13, file$1, 96, 6, 4345);
    			attr_dev(div7, "class", "col-md-4");
    			add_location(div7, file$1, 95, 4, 4315);
    			add_location(b7, file$1, 99, 6, 4444);
    			add_location(br2, file$1, 100, 68, 4527);
    			add_location(b8, file$1, 101, 6, 4541);
    			attr_dev(a, "href", "https://github.com/ThaUnknown/");
    			add_location(a, file$1, 101, 21, 4556);
    			attr_dev(div8, "class", "col-8 font-size-16");
    			add_location(div8, file$1, 98, 4, 4404);
    			attr_dev(div9, "class", "row py-20");
    			add_location(div9, file$1, 94, 2, 4286);
    			attr_dev(div10, "class", "content");
    			add_location(div10, file$1, 36, 0, 914);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h10);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, b0);
    			append_dev(div1, t4);
    			append_dev(div1, b1);
    			append_dev(div1, t6);
    			append_dev(div1, b2);
    			append_dev(b2, t7);
    			append_dev(b2, span);
    			append_dev(b2, t9);
    			append_dev(div1, br0);
    			append_dev(div1, br1);
    			append_dev(div1, t10);
    			append_dev(div1, b3);
    			append_dev(div1, t12);
    			append_dev(div1, b4);
    			append_dev(div1, t14);
    			append_dev(div1, b5);
    			append_dev(div1, t16);
    			append_dev(div1, b6);
    			append_dev(div10, t18);
    			append_dev(div10, hr0);
    			append_dev(div10, t19);
    			append_dev(div10, div5);
    			append_dev(div5, div3);
    			append_dev(div3, h11);
    			append_dev(div3, t21);
    			append_dev(div3, p);
    			append_dev(div5, t23);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div4, null);
    			}

    			append_dev(div10, t24);
    			append_dev(div10, hr1);
    			append_dev(div10, t25);
    			append_dev(div10, h12);
    			append_dev(div10, t27);
    			append_dev(div10, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			if (each1_else) {
    				each1_else.m(div6, null);
    			}

    			append_dev(div10, t28);
    			append_dev(div10, hr2);
    			append_dev(div10, t29);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div7, h13);
    			append_dev(div9, t31);
    			append_dev(div9, div8);
    			append_dev(div8, b7);
    			append_dev(div8, t33);
    			append_dev(div8, t34);
    			append_dev(div8, br2);
    			append_dev(div8, t35);
    			append_dev(div8, b8);
    			append_dev(div8, t37);
    			append_dev(div8, a);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, icons*/ 0) {
    				each_value_1 = Object.entries(icons);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*repos*/ 1) {
    				each_value = /*repos*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each1_else) {
    						each1_else.d(1);
    						each1_else = null;
    					}
    				} else if (!each1_else) {
    					each1_else = create_else_block(ctx);
    					each1_else.c();
    					each1_else.m(div6, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (each1_else) each1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const icons = {
    	// sorted: web, non-web
    	// languages
    	JavaScript: 'js',
    	NodeJS: 'nodejs',
    	Svelte: 'svelte',
    	WebAssembly: 'wasm', // technology?
    	'C++': 'c++',
    	// "containers"
    	ProgressiveWebApps: 'pwa',
    	Electron: 'electron',
    	Chromium: 'chromium',
    	// technologies
    	WebRTC: 'webrtc',
    	Canvas: 'canvas',
    	Matroska: 'mkv',
    	BitTorrent: 'bittorrent',
    	// tools
    	Vite: 'vite',
    	Webpack: 'webpack',
    	Git: 'git',
    	GitHub: 'github',
    	CloudFlare: 'cloudflare',
    	GoogleCloud: 'cloud'
    };

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	let repos = [];

    	fetch('https://api.github.com/users/ThaUnknown/repos?sort=updated&direction=desc').then(async res => {
    		$$invalidate(0, repos = (await res.json()).sort((a, b) => b.stargazers_count - a.stargazers_count).filter(repo => !repo.fork));
    		console.log(repos);
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ icons, repos });

    	$$self.$inject_state = $$props => {
    		if ('repos' in $$props) $$invalidate(0, repos = $$props.repos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [repos];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let landingcard;
    	let t;
    	let div1;
    	let div0;
    	let content;
    	let current;
    	landingcard = new LandingCard({ $$inline: true });
    	content = new Content({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			create_component(landingcard.$$.fragment);
    			t = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "container my-20 py-20");
    			add_location(div0, file, 9, 6, 275);
    			attr_dev(div1, "class", "d-flex w-full bg-dark-light");
    			add_location(div1, file, 8, 4, 227);
    			attr_dev(div2, "class", "content-wrapper overflow-x-hidden svelte-1p4m11");
    			add_location(div2, file, 6, 2, 155);
    			attr_dev(div3, "class", "page-wrapper");
    			add_location(div3, file, 5, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			mount_component(landingcard, div2, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(content, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landingcard.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landingcard.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(landingcard);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ LandingCard, Content });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
