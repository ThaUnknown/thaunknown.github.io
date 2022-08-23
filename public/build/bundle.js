
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function noop() { }
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
function append(target, node) {
    target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
        const style = element('style');
        style.id = style_sheet_id;
        style.textContent = styles;
        append_stylesheet(append_styles_to, style);
    }
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
function children(element) {
    return Array.from(element.childNodes);
}
function set_style(node, key, value, important) {
    if (value === null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
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
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
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
    else if (callback) {
        callback();
    }
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
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
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
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

/* src\modules\Footer.svelte generated by Svelte v3.49.0 */

const file$6 = "src\\modules\\Footer.svelte";

function create_fragment$7(ctx) {
	let div3;
	let hr;
	let t0;
	let div2;
	let div0;
	let t3;
	let div1;
	let b0;
	let t5;
	let a0;
	let t6;
	let br;
	let t7;
	let b1;
	let t9;
	let a1;

	const block = {
		c: function create() {
			div3 = element("div");
			hr = element("hr");
			t0 = space();
			div2 = element("div");
			div0 = element("div");
			div0.textContent = `ThaUnknown_ © 2021 - ${new Date().getFullYear()}`;
			t3 = space();
			div1 = element("div");
			b0 = element("b");
			b0.textContent = "Email:";
			t5 = space();
			a0 = element("a");
			t6 = text(email);
			br = element("br");
			t7 = space();
			b1 = element("b");
			b1.textContent = "GitHub:";
			t9 = space();
			a1 = element("a");
			a1.textContent = "https://github.com/ThaUnknown";
			add_location(hr, file$6, 9, 2, 314);
			add_location(div0, file$6, 11, 4, 384);
			add_location(b0, file$6, 15, 6, 475);
			attr_dev(a0, "href", "mailto:" + email);
			add_location(a0, file$6, 16, 6, 496);
			add_location(br, file$6, 16, 42, 532);
			add_location(b1, file$6, 17, 6, 546);
			attr_dev(a1, "href", "https://github.com/ThaUnknown/");
			add_location(a1, file$6, 17, 21, 561);
			add_location(div1, file$6, 14, 4, 462);
			attr_dev(div2, "class", "d-flex w-full justify-content-around pt-20");
			add_location(div2, file$6, 10, 2, 322);
			attr_dev(div3, "class", "container py-20");
			add_location(div3, file$6, 8, 0, 261);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, hr);
			append_dev(div3, t0);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div1, b0);
			append_dev(div1, t5);
			append_dev(div1, a0);
			append_dev(a0, t6);
			append_dev(div1, br);
			append_dev(div1, t7);
			append_dev(div1, b1);
			append_dev(div1, t9);
			append_dev(div1, a1);
			/*div3_binding*/ ctx[0](div3);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			/*div3_binding*/ ctx[0](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

let contact = null;

function scrollContact() {
	// this is a bad idea
	contact?.scrollIntoView({ behavior: 'smooth' });
}

const email = decodeURIComponent(atob('Y2FzaXN0YWtlbiU0MGdtYWlsLmNvbQ=='));

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Footer', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
	});

	function div3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			contact = $$value;
		});
	}

	$$self.$capture_state = () => ({ contact, scrollContact, email });
	return [div3_binding];
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$7.name
		});
	}
}

/* src\modules\Transitions.svelte generated by Svelte v3.49.0 */

const file$5 = "src\\modules\\Transitions.svelte";

function add_css$4(target) {
	append_styles(target, "svelte-1mr8qny", "@keyframes svelte-1mr8qny-transition{0%{background-position:top right;width:0}30%{width:100vw}35%{background-position:top left}65%{background-position:top left;width:100vw}95%{background-position:top right\r\n    }100%{width:0 !important}}.con.svelte-1mr8qny{z-index:90;width:0}.animate.svelte-1mr8qny{animation:2s svelte-1mr8qny-transition ease forwards}.text.svelte-1mr8qny{font-size:10rem;color:transparent;width:100vw;background:linear-gradient(90deg, #fff 50%, #000 0), linear-gradient(90deg, #000 50%, #fff 0);background-repeat:no-repeat;background-size:200% 100%;background-position:inherit;-webkit-background-clip:text, padding-box;background-clip:text, padding-box}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNpdGlvbnMuc3ZlbHRlIiwibWFwcGluZ3MiOiI7aWRBaUVBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlRyYW5zaXRpb25zLnN2ZWx0ZSJdfQ== */");
}

function create_fragment$6(ctx) {
	let div1;
	let div0;
	let t;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			t = text(/*animate*/ ctx[0]);
			attr_dev(div0, "class", "h-full text d-flex align-items-center justify-content-center text-nowrap text-capitalize svelte-1mr8qny");
			add_location(div0, file$5, 19, 2, 619);
			attr_dev(div1, "class", "h-full con font-weight-bold overflow-hidden position-absolute svelte-1mr8qny");
			toggle_class(div1, "animate", /*animate*/ ctx[0]);
			add_location(div1, file$5, 18, 0, 509);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, t);
			/*div1_binding*/ ctx[3](div1);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*animate*/ 1) set_data_dev(t, /*animate*/ ctx[0]);

			if (dirty & /*animate*/ 1) {
				toggle_class(div1, "animate", /*animate*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			/*div1_binding*/ ctx[3](null);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

let transition = () => {
	
};

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Transitions', slots, []);
	let animate = false;
	let root = null;
	let { page = 'home' } = $$props;

	transition = async target => {
		$$invalidate(0, animate = false);
		await Promise.resolve();

		// eslint-disable-next-line no-unused-vars
		root.offsetHeight; // force trigger DOM reflow to restart animation

		$$invalidate(0, animate = target);

		setTimeout(
			() => {
				$$invalidate(2, page = target); // transition in the middle of animation
			},
			1000
		);
	};

	const writable_props = ['page'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Transitions> was created with unknown prop '${key}'`);
	});

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			root = $$value;
			$$invalidate(1, root);
		});
	}

	$$self.$$set = $$props => {
		if ('page' in $$props) $$invalidate(2, page = $$props.page);
	};

	$$self.$capture_state = () => ({ transition, animate, root, page });

	$$self.$inject_state = $$props => {
		if ('animate' in $$props) $$invalidate(0, animate = $$props.animate);
		if ('root' in $$props) $$invalidate(1, root = $$props.root);
		if ('page' in $$props) $$invalidate(2, page = $$props.page);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [animate, root, page, div1_binding];
}

class Transitions extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$6, safe_not_equal, { page: 2 }, add_css$4);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Transitions",
			options,
			id: create_fragment$6.name
		});
	}

	get page() {
		throw new Error("<Transitions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set page(value) {
		throw new Error("<Transitions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\modules\Navbar.svelte generated by Svelte v3.49.0 */
const file$4 = "src\\modules\\Navbar.svelte";

// (7:0) {#if page !== 'home'}
function create_if_block(ctx) {
	let nav;
	let div0;
	let t1;
	let ul;
	let li0;
	let div1;
	let t3;
	let li1;
	let div2;
	let t5;
	let li2;
	let div3;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			nav = element("nav");
			div0 = element("div");
			div0.textContent = "ThaUnknown";
			t1 = space();
			ul = element("ul");
			li0 = element("li");
			div1 = element("div");
			div1.textContent = "Showcase";
			t3 = space();
			li1 = element("li");
			div2 = element("div");
			div2.textContent = "Projects";
			t5 = space();
			li2 = element("li");
			div3 = element("div");
			div3.textContent = "Contact";
			attr_dev(div0, "class", "navbar-brand pointer font-weight-bold");
			add_location(div0, file$4, 9, 4, 239);
			attr_dev(div1, "class", "nav-link");
			add_location(div1, file$4, 14, 8, 624);
			attr_dev(li0, "class", "nav-item font-weight-bold");
			toggle_class(li0, "active", /*page*/ ctx[0] === 'showcase');
			add_location(li0, file$4, 13, 6, 501);
			attr_dev(div2, "class", "nav-link");
			add_location(div2, file$4, 17, 8, 804);
			attr_dev(li1, "class", "nav-item font-weight-bold");
			toggle_class(li1, "active", /*page*/ ctx[0] === 'projects');
			add_location(li1, file$4, 16, 6, 681);
			attr_dev(div3, "class", "nav-link");
			add_location(div3, file$4, 20, 8, 934);
			attr_dev(li2, "class", "nav-item font-weight-bold");
			add_location(li2, file$4, 19, 6, 861);
			attr_dev(ul, "class", "navbar-nav ml-auto");
			add_location(ul, file$4, 12, 4, 362);
			attr_dev(nav, "class", "navbar px-20");
			add_location(nav, file$4, 7, 2, 180);
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, div0);
			append_dev(nav, t1);
			append_dev(nav, ul);
			append_dev(ul, li0);
			append_dev(li0, div1);
			append_dev(ul, t3);
			append_dev(ul, li1);
			append_dev(li1, div2);
			append_dev(ul, t5);
			append_dev(ul, li2);
			append_dev(li2, div3);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "click", /*click_handler*/ ctx[1], false, false, false),
					listen_dev(li0, "click", /*click_handler_1*/ ctx[2], false, false, false),
					listen_dev(li1, "click", /*click_handler_2*/ ctx[3], false, false, false),
					listen_dev(li2, "click", scrollContact, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*page*/ 1) {
				toggle_class(li0, "active", /*page*/ ctx[0] === 'showcase');
			}

			if (dirty & /*page*/ 1) {
				toggle_class(li1, "active", /*page*/ ctx[0] === 'projects');
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(7:0) {#if page !== 'home'}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let if_block = /*page*/ ctx[0] !== 'home' && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*page*/ ctx[0] !== 'home') {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Navbar', slots, []);
	let { page = 'home' } = $$props;
	const writable_props = ['page'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
	});

	const click_handler = () => transition('home');
	const click_handler_1 = () => transition('showcase');
	const click_handler_2 = () => transition('projects');

	$$self.$$set = $$props => {
		if ('page' in $$props) $$invalidate(0, page = $$props.page);
	};

	$$self.$capture_state = () => ({ scrollContact, transition, page });

	$$self.$inject_state = $$props => {
		if ('page' in $$props) $$invalidate(0, page = $$props.page);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [page, click_handler, click_handler_1, click_handler_2];
}

class Navbar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$5, safe_not_equal, { page: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Navbar",
			options,
			id: create_fragment$5.name
		});
	}

	get page() {
		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set page(value) {
		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\modules\Showcase.svelte generated by Svelte v3.49.0 */
const file$3 = "src\\modules\\Showcase.svelte";

function add_css$3(target) {
	append_styles(target, "svelte-bf5rin", ".animate.svelte-bf5rin.svelte-bf5rin{opacity:0;animation-name:svelte-bf5rin-load-in;animation-duration:.4s;animation-timing-function:ease;animation-iteration-count:1;animation-delay:var(--delay);animation-fill-mode:forwards}@keyframes svelte-bf5rin-load-in{from{opacity:0;bottom:-1.2rem;transform:scale(0.95)}to{opacity:1;bottom:0;transform:scale(1)}}.featured.svelte-bf5rin.svelte-bf5rin{gap:10px;grid-template-columns:repeat(12, 1fr);margin-bottom:15rem}.featured.svelte-bf5rin:nth-of-type(2n+1) .about.svelte-bf5rin{grid-column:7 / -1;text-align:right}.featured.svelte-bf5rin .about.svelte-bf5rin{grid-area:1 / 1 / -1 / 7}.featured.svelte-bf5rin:nth-of-type(2n+1) .image.svelte-bf5rin{grid-column:1 / 8}.featured.svelte-bf5rin .image.svelte-bf5rin{grid-area:1 / 6 / -1 / -1}.image.svelte-bf5rin.svelte-bf5rin{filter:grayscale(100%) brightness(60%) blur(4px);transition:filter .2s ease\r\n  }.image.svelte-bf5rin.svelte-bf5rin:hover{filter:none\r\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hvd2Nhc2Uuc3ZlbHRlIiwibWFwcGluZ3MiOiI7O0dBb0dBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlNob3djYXNlLnN2ZWx0ZSJdfQ== */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i].title;
	child_ctx[3] = list[i].description;
	child_ctx[4] = list[i].image;
	child_ctx[5] = list[i].tech;
	child_ctx[8] = i;
	const constants_0 = 800 + /*i*/ child_ctx[8] * 500;
	child_ctx[6] = constants_0;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[8] = i;
	const constants_0 = /*delay*/ child_ctx[6] + 80 * (/*i*/ child_ctx[8] + 1);
	child_ctx[10] = constants_0;
	return child_ctx;
}

// (38:12) {#each tech as item, i}
function create_each_block_1(ctx) {
	let div;
	let t_value = /*item*/ ctx[9] + "";
	let t;
	let style___delay = `${/*smalldelay*/ ctx[10]}ms`;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			attr_dev(div, "class", "px-10 py-5 d-inline-block animate svelte-bf5rin");
			set_style(div, "--delay", style___delay, false);
			add_location(div, file$3, 39, 14, 2420);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(38:12) {#each tech as item, i}",
		ctx
	});

	return block;
}

// (27:4) {#each projects as { title, description, image, tech }
function create_each_block(ctx) {
	let div7;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div6;
	let div1;
	let t2;
	let div2;
	let t3_value = /*title*/ ctx[2] + "";
	let t3;
	let t4;
	let div3;
	let t5_value = /*description*/ ctx[3] + "";
	let t5;
	let t6;
	let div4;
	let t7;
	let div5;
	let button;
	let t9;
	let style___delay = `${/*delay*/ ctx[6]}ms`;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[0](/*title*/ ctx[2]);
	}

	let each_value_1 = /*tech*/ ctx[5];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[1](/*title*/ ctx[2]);
	}

	const block = {
		c: function create() {
			div7 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div6 = element("div");
			div1 = element("div");
			div1.textContent = "Featured Project";
			t2 = space();
			div2 = element("div");
			t3 = text(t3_value);
			t4 = space();
			div3 = element("div");
			t5 = text(t5_value);
			t6 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t7 = space();
			div5 = element("div");
			button = element("button");
			button.textContent = "About";
			t9 = space();
			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[4])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "preview");
			attr_dev(img, "class", "shadow-lg rounded img-cover w-full h-full");
			add_location(img, file$3, 30, 10, 1815);
			attr_dev(div0, "class", "image z-0 pointer svelte-bf5rin");
			add_location(div0, file$3, 29, 8, 1719);
			attr_dev(div1, "class", "text-primary font-weight-bold");
			add_location(div1, file$3, 33, 10, 2037);
			attr_dev(div2, "class", "font-size-24 font-weight-bold text-white");
			add_location(div2, file$3, 34, 10, 2114);
			attr_dev(div3, "class", "w-full my-20 p-20 bg-dark rounded shadow-lg");
			add_location(div3, file$3, 35, 10, 2193);
			attr_dev(div4, "class", "text-monospace");
			add_location(div4, file$3, 36, 10, 2281);
			attr_dev(button, "class", "btn btn-primary border mt-10");
			attr_dev(button, "type", "button");
			add_location(button, file$3, 43, 12, 2580);
			add_location(div5, file$3, 42, 10, 2561);
			attr_dev(div6, "class", "about z-10 position-absolute p-md-0 p-20 d-flex flex-column justify-content-center h-full svelte-bf5rin");
			add_location(div6, file$3, 32, 8, 1922);
			attr_dev(div7, "class", "featured h-400 d-flex d-md-grid position-relative animate svelte-bf5rin");
			set_style(div7, "--delay", style___delay, false);
			add_location(div7, file$3, 28, 6, 1612);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div7, anchor);
			append_dev(div7, div0);
			append_dev(div0, img);
			append_dev(div7, t0);
			append_dev(div7, div6);
			append_dev(div6, div1);
			append_dev(div6, t2);
			append_dev(div6, div2);
			append_dev(div2, t3);
			append_dev(div6, t4);
			append_dev(div6, div3);
			append_dev(div3, t5);
			append_dev(div6, t6);
			append_dev(div6, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div4, null);
			}

			append_dev(div6, t7);
			append_dev(div6, div5);
			append_dev(div5, button);
			append_dev(div7, t9);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "click", click_handler, false, false, false),
					listen_dev(button, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*projects*/ 0) {
				each_value_1 = /*tech*/ ctx[5];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div7);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(27:4) {#each projects as { title, description, image, tech }",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let div1;
	let div0;
	let each_value = projects;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "content");
			add_location(div0, file$3, 25, 2, 1481);
			attr_dev(div1, "class", "container");
			add_location(div1, file$3, 24, 0, 1454);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*transition, projects*/ 0) {
				each_value = projects;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks, detaching);
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

const projects = [
	{
		title: 'Miru',
		description: 'A simple to use, anime torrent streaming app. Allows you to watch any anime, real-time with no waiting for downloads, with friends, while synching all your progress with you anime list for free with no ads or limits.',
		image: 'https://raw.githubusercontent.com/ThaUnknown/miru/HEAD/docs/show.gif',
		tech: [
			'Svelte',
			'Electron',
			'Vite',
			'GraphQL',
			'WASM',
			'Node.js',
			'BitTorrent',
			'WebRTC'
		]
	},
	{
		title: 'PWA Haven',
		description: 'Progressive Web Apps which replace oversized native apps, with simple, lightweight browser based apps, which don\'t create copies of processes, but instead share one environment, which likely was already in-use by the user, for example browsing the web or reading articles, eliminating those duplicate processes.',
		image: 'https://raw.githubusercontent.com/ThaUnknown/pwa-haven/HEAD/docs/haven.png',
		tech: ['Svelte', 'Webpack', 'Rollup', 'WASM', 'PWA', 'WebRTC']
	},
	{
		title: 'Portfolio',
		description: 'Fully hardware accelerated portfolio, with fancy transitions and animations that don\'t use and hacky patches, styles or other shenanigans which slows down rendering.',
		image: './public/images/portfolio.webp',
		tech: ['Svelte', 'Rollup', 'WASM', 'three.js']
	}
];

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Showcase', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Showcase> was created with unknown prop '${key}'`);
	});

	const click_handler = title => {
		transition(title.toLowerCase());
	};

	const click_handler_1 = title => {
		transition(title.toLowerCase());
	};

	$$self.$capture_state = () => ({ transition, projects });
	return [click_handler, click_handler_1];
}

class Showcase extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$4, safe_not_equal, {}, add_css$3);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Showcase",
			options,
			id: create_fragment$4.name
		});
	}
}

/* src\modules\Home.svelte generated by Svelte v3.49.0 */
const file$2 = "src\\modules\\Home.svelte";

function add_css$2(target) {
	append_styles(target, "svelte-3q2osr", ".btn.svelte-3q2osr{transition:transform 0.3s ease}.btn.svelte-3q2osr:hover{transform:scale(1.1)}.hero.svelte-3q2osr{transform:translateZ(200px) scale(.5)}.hero-title.svelte-3q2osr{animation:svelte-3q2osr-text-pop-up-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 3s both;font-size:5rem}.about.svelte-3q2osr{width:1rem;height:1rem;border-left:3px solid #fff;border-bottom:3px solid #fff;transform:rotate(-45deg);animation:svelte-3q2osr-more 1.5s infinite}@keyframes svelte-3q2osr-more{0%{transform:rotate(-45deg) translate(0, 0);opacity:0}50%{opacity:1}100%{transform:rotate(-45deg) translate(-20px, 20px);opacity:0}}@keyframes svelte-3q2osr-text-pop-up-top{0%{transform:translateY(0);transform-origin:50% 50%;text-shadow:none}100%{transform:translateY(-20px);transform-origin:50% 50%;text-shadow:0 1px 0 #bbb, 0 2px 0 #bbb, 0 3px 0 #bbb, 0 4px 0 #bbb, 0 5px 0 #bbb, 0 6px 0 #bbb, 0 7px 0 #bbb, 0 8px 0 #bbb, 0 9px 0 #bbb, 0 50px 30px rgba(0, 0, 0, 0.3)}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG9tZS5zdmVsdGUiLCJtYXBwaW5ncyI6IjY3QkFvSkEiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiSG9tZS5zdmVsdGUiXX0= */");
}

function create_fragment$3(ctx) {
	let section0;
	let div0;
	let t0;
	let div3;
	let div1;
	let t2;
	let div2;
	let t4;
	let button0;
	let t6;
	let button1;
	let t8;
	let a;
	let div4;
	let t9;
	let section1;
	let div5;
	let p0;
	let t10;
	let b0;
	let t12;
	let b1;
	let t14;
	let b2;
	let t15;
	let span;
	let t17;
	let t18;
	let p1;
	let t19;
	let b3;
	let t21;
	let b4;
	let t23;
	let b5;
	let t25;
	let b6;
	let t27;
	let t28;
	let p2;
	let t29;
	let b7;
	let t31;
	let t32;
	let p3;
	let button2;
	let t34;
	let button3;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			section0 = element("section");
			div0 = element("div");
			t0 = space();
			div3 = element("div");
			div1 = element("div");
			div1.textContent = "I'm Cas.";
			t2 = space();
			div2 = element("div");
			div2.textContent = "Software Developer. Web-Dev Enthusiast.";
			t4 = space();
			button0 = element("button");
			button0.textContent = "Showcase";
			t6 = space();
			button1 = element("button");
			button1.textContent = "Contact";
			t8 = space();
			a = element("a");
			div4 = element("div");
			t9 = space();
			section1 = element("section");
			div5 = element("div");
			p0 = element("p");
			t10 = text("Hi, I'm ");
			b0 = element("b");
			b0.textContent = "Cas";
			t12 = text(", but online I go as ");
			b1 = element("b");
			b1.textContent = "ThaUnknown_";
			t14 = text(", as I don't reveal much information about myself and\r\n      ");
			b2 = element("b");
			t15 = text("take privacy ");
			span = element("span");
			span.textContent = "relatively";
			t17 = text(" seriously.");
			t18 = space();
			p1 = element("p");
			t19 = text("I'm a ");
			b3 = element("b");
			b3.textContent = "self-taught";
			t21 = text(" developer based in Europe. I specialize in ");
			b4 = element("b");
			b4.textContent = "frontend";
			t23 = text(" development, handling and ");
			b5 = element("b");
			b5.textContent = "streaming";
			t25 = text(" large amounts of data, and any new shiny\r\n      ");
			b6 = element("b");
			b6.textContent = "experimental API";
			t27 = text(".");
			t28 = space();
			p2 = element("p");
			t29 = text("I always put ");
			b7 = element("b");
			b7.textContent = "simplicity and performance";
			t31 = text(" first, to ensure my apps are snappy and lightweight.");
			t32 = space();
			p3 = element("p");
			button2 = element("button");
			button2.textContent = "Showcase";
			t34 = space();
			button3 = element("button");
			button3.textContent = "Projects";
			add_location(div0, file$2, 62, 2, 1638);
			attr_dev(div1, "class", "font-weight-bold hero-title text-white svelte-3q2osr");
			add_location(div1, file$2, 64, 4, 1686);
			attr_dev(div2, "class", "font-size-24 mb-20");
			add_location(div2, file$2, 65, 4, 1758);
			attr_dev(button0, "class", "btn btn-lg btn-transparent border svelte-3q2osr");
			attr_dev(button0, "type", "button");
			add_location(button0, file$2, 66, 4, 1841);
			attr_dev(button1, "class", "btn btn-lg btn-primary ml-10 svelte-3q2osr");
			attr_dev(button1, "type", "button");
			add_location(button1, file$2, 67, 4, 1972);
			attr_dev(div3, "class", "container content");
			add_location(div3, file$2, 63, 2, 1649);
			attr_dev(div4, "class", "about mb-20 svelte-3q2osr");
			add_location(div4, file$2, 70, 87, 2229);
			attr_dev(a, "class", "w-full d-flex justify-content-center py-20 pointer");
			add_location(a, file$2, 70, 2, 2144);
			attr_dev(section0, "class", "h-full d-flex flex-column justify-content-between hero svelte-3q2osr");
			add_location(section0, file$2, 61, 0, 1545);
			add_location(b0, file$2, 75, 14, 2388);
			add_location(b1, file$2, 75, 45, 2419);
			attr_dev(span, "class", "font-size-12 font-weight-normal");
			add_location(span, file$2, 76, 22, 2514);
			add_location(b2, file$2, 76, 6, 2498);
			add_location(p0, file$2, 74, 4, 2369);
			add_location(b3, file$2, 79, 12, 2625);
			add_location(b4, file$2, 79, 74, 2687);
			add_location(b5, file$2, 79, 116, 2729);
			add_location(b6, file$2, 80, 6, 2794);
			add_location(p1, file$2, 78, 4, 2608);
			add_location(b7, file$2, 82, 20, 2850);
			add_location(p2, file$2, 82, 4, 2834);
			attr_dev(button2, "class", "btn btn-lg btn-transparent border svelte-3q2osr");
			attr_dev(button2, "type", "button");
			add_location(button2, file$2, 84, 6, 2971);
			attr_dev(button3, "class", "btn btn-primary btn-lg btn-transparent border ml-10 svelte-3q2osr");
			attr_dev(button3, "type", "button");
			add_location(button3, file$2, 85, 6, 3104);
			attr_dev(p3, "class", "pt-20");
			add_location(p3, file$2, 83, 4, 2946);
			attr_dev(div5, "class", "content");
			add_location(div5, file$2, 73, 2, 2342);
			attr_dev(section1, "class", "container font-size-16 mb-20");
			add_location(section1, file$2, 72, 0, 2274);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, section0, anchor);
			append_dev(section0, div0);
			append_dev(section0, t0);
			append_dev(section0, div3);
			append_dev(div3, div1);
			append_dev(div3, t2);
			append_dev(div3, div2);
			append_dev(div3, t4);
			append_dev(div3, button0);
			append_dev(div3, t6);
			append_dev(div3, button1);
			append_dev(section0, t8);
			append_dev(section0, a);
			append_dev(a, div4);
			/*section0_binding*/ ctx[1](section0);
			insert_dev(target, t9, anchor);
			insert_dev(target, section1, anchor);
			append_dev(section1, div5);
			append_dev(div5, p0);
			append_dev(p0, t10);
			append_dev(p0, b0);
			append_dev(p0, t12);
			append_dev(p0, b1);
			append_dev(p0, t14);
			append_dev(p0, b2);
			append_dev(b2, t15);
			append_dev(b2, span);
			append_dev(b2, t17);
			append_dev(div5, t18);
			append_dev(div5, p1);
			append_dev(p1, t19);
			append_dev(p1, b3);
			append_dev(p1, t21);
			append_dev(p1, b4);
			append_dev(p1, t23);
			append_dev(p1, b5);
			append_dev(p1, t25);
			append_dev(p1, b6);
			append_dev(p1, t27);
			append_dev(div5, t28);
			append_dev(div5, p2);
			append_dev(p2, t29);
			append_dev(p2, b7);
			append_dev(p2, t31);
			append_dev(div5, t32);
			append_dev(div5, p3);
			append_dev(p3, button2);
			append_dev(p3, t34);
			append_dev(p3, button3);
			/*section1_binding*/ ctx[4](section1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false),
					listen_dev(button1, "click", scrollContact, false, false, false),
					listen_dev(a, "click", scrollAbout, false, false, false),
					listen_dev(button2, "click", /*click_handler_1*/ ctx[2], false, false, false),
					listen_dev(button3, "click", /*click_handler_2*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(section0);
			/*section0_binding*/ ctx[1](null);
			if (detaching) detach_dev(t9);
			if (detaching) detach_dev(section1);
			/*section1_binding*/ ctx[4](null);
			mounted = false;
			run_all(dispose);
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

let about;

// const icons = {
//   // sorted: web, non-web
//   // languages
//   JavaScript: 'js',
//   NodeJS: 'nodejs',
//   Svelte: 'svelte',
//   WebAssembly: 'wasm', // technology?
//   'C++': 'c++',
//   // "containers"
//   ProgressiveWebApps: 'pwa',
//   Electron: 'electron',
//   Chromium: 'chromium',
//   // technologies
//   GraphQL: 'graphql',
//   Emscripten: 'ems',
//   WebRTC: 'webrtc',
//   Canvas: 'canvas',
//   // Matroska: 'mkv',
//   BitTorrent: 'bittorrent',
//   // tools
//   Vite: 'vite',
//   Webpack: 'webpack',
//   Git: 'git',
//   GitHub: 'github',
//   CloudFlare: 'cloudflare',
//   GoogleCloud: 'cloud'
// }
function scrollAbout() {
	about.scrollIntoView({ behavior: 'smooth' });
}

let hero;
const THREE = import('./3d.js').then(function (n) { return n.t; });
const net = import('./vanta.net.js');

function instance_1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Home', slots, []);
	let instance = null;

	onMount(async () => {
		instance = (await net).default({
			el: hero,
			mouseControls: true,
			touchControls: true,
			gyroControls: true,
			minHeight: 200.00,
			minWidth: 200.00,
			scale: 1.00,
			scaleMobile: 1.00,
			color: 0x7f47dd,
			backgroundColor: 0x0,
			THREE: await THREE
		});
	});

	onDestroy(() => {
		instance?.destroy();
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		transition('showcase');
	};

	function section0_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			hero = $$value;
		});
	}

	const click_handler_1 = () => {
		transition('showcase');
	};

	const click_handler_2 = () => {
		transition('Projects');
	};

	function section1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			about = $$value;
		});
	}

	$$self.$capture_state = () => ({
		scrollContact,
		onDestroy,
		onMount,
		transition,
		about,
		scrollAbout,
		hero,
		THREE,
		net,
		instance
	});

	$$self.$inject_state = $$props => {
		if ('instance' in $$props) instance = $$props.instance;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		click_handler,
		section0_binding,
		click_handler_1,
		click_handler_2,
		section1_binding
	];
}

class Home extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance_1, create_fragment$3, safe_not_equal, {}, add_css$2);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Home",
			options,
			id: create_fragment$3.name
		});
	}
}

/* src\modules\Router.svelte generated by Svelte v3.49.0 */

function create_fragment$2(ctx) {
	let switch_instance;
	let t;
	let footer;
	let current;
	var switch_value = pages[/*page*/ ctx[0]];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	footer = new Footer({ $$inline: true });

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			t = space();
			create_component(footer.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, t, anchor);
			mount_component(footer, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (switch_value !== (switch_value = pages[/*page*/ ctx[0]])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, t.parentNode, t);
				} else {
					switch_instance = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			transition_in(footer.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			transition_out(footer.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (switch_instance) destroy_component(switch_instance, detaching);
			if (detaching) detach_dev(t);
			destroy_component(footer, detaching);
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

const pages = { home: Home, showcase: Showcase };

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Router', slots, []);
	let { page = 'home' } = $$props;
	const writable_props = ['page'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('page' in $$props) $$invalidate(0, page = $$props.page);
	};

	$$self.$capture_state = () => ({ Home, Showcase, Footer, pages, page });

	$$self.$inject_state = $$props => {
		if ('page' in $$props) $$invalidate(0, page = $$props.page);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [page];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { page: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$2.name
		});
	}

	get page() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set page(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\modules\Loader.svelte generated by Svelte v3.49.0 */
const file$1 = "src\\modules\\Loader.svelte";

function add_css$1(target) {
	append_styles(target, "svelte-1x3p768", "@keyframes svelte-1x3p768-background{from{background-position:top right }to{background-position:top left }}@keyframes svelte-1x3p768-un-background{from{background-position:top left }to{background-position:top right }}@keyframes svelte-1x3p768-stroke{0%{transform:scale(1);stroke:#fff;fill:#000}20%{fill:#000;background:#000}21%{background:#fff;fill:#000}40%{fill:#000;stroke:#fff}41%{fill:#fff;stroke:#000}60%{background:#fff;fill:#fff;stroke:#000}61%{background:none;fill:#000;stroke:#fff}80%{transform:scale(1.2);fill:#000;stroke:#fff}81%{transform:scale(1.1);fill:#fff;stroke:#000}100%{transform:scale(1);background:none;fill:#fff;stroke:#000}}svg.svelte-1x3p768{animation:svelte-1x3p768-stroke .8s forwards;fill:#000;stroke:#fff}.con.svelte-1x3p768{transition:width 1s ease;z-index:100}svg.svelte-1x3p768{font-size:10rem}.text.svelte-1x3p768{font-size:10rem;color:transparent;width:100vw;background:linear-gradient(90deg, #fff 50%, #000 0), linear-gradient(90deg, #000 50%, #fff 0);background-repeat:no-repeat;background-size:200% 100%;background-position:top right;-webkit-background-clip:text, padding-box;background-clip:text, padding-box;animation:.8s svelte-1x3p768-background ease forwards}.transition.svelte-1x3p768{animation:.8s svelte-1x3p768-un-background ease forwards}.hide.svelte-1x3p768{width:0 !important}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGVyLnN2ZWx0ZSIsIm1hcHBpbmdzIjoiNHlDQXdIQSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJMb2FkZXIuc3ZlbHRlIl19 */");
}

function create_fragment$1(ctx) {
	let div2;
	let div1;
	let div0;
	let t0;
	let div0_class_value;
	let t1;
	let svg_1;
	let text_1;
	let t2;
	let svg_1_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t0 = text("Loading....");
			t1 = space();
			svg_1 = svg_element("svg");
			text_1 = svg_element("text");
			t2 = text("Loading....");
			attr_dev(div0, "class", div0_class_value = /*svg*/ ctx[1] ? 'd-none' : 'd-flex');
			add_location(div0, file$1, 23, 4, 559);
			attr_dev(text_1, "x", "50%");
			attr_dev(text_1, "y", "50%");
			attr_dev(text_1, "dy", "4.15rem");
			attr_dev(text_1, "text-anchor", "middle");
			attr_dev(text_1, "font-size", "10rem");
			attr_dev(text_1, "font-weight", "700");
			attr_dev(text_1, "stroke-width", "1px");
			add_location(text_1, file$1, 25, 6, 684);
			attr_dev(svg_1, "class", svg_1_class_value = "w-full h-full " + (/*svg*/ ctx[1] ? 'd-flex' : 'd-none') + " svelte-1x3p768");
			add_location(svg_1, file$1, 24, 4, 621);
			attr_dev(div1, "class", "h-full text d-flex align-items-center justify-content-center text-nowrap svelte-1x3p768");
			toggle_class(div1, "transition", /*hide*/ ctx[0]);
			add_location(div1, file$1, 22, 2, 443);
			attr_dev(div2, "class", "w-full h-full con font-weight-bold overflow-hidden position-absolute svelte-1x3p768");
			toggle_class(div2, "hide", /*hide*/ ctx[0]);
			add_location(div2, file$1, 21, 0, 346);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, div0);
			append_dev(div0, t0);
			append_dev(div1, t1);
			append_dev(div1, svg_1);
			append_dev(svg_1, text_1);
			append_dev(text_1, t2);

			if (!mounted) {
				dispose = listen_dev(window, "DOMContentLoaded", /*hideLoader*/ ctx[2], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*svg*/ 2 && div0_class_value !== (div0_class_value = /*svg*/ ctx[1] ? 'd-none' : 'd-flex')) {
				attr_dev(div0, "class", div0_class_value);
			}

			if (dirty & /*svg*/ 2 && svg_1_class_value !== (svg_1_class_value = "w-full h-full " + (/*svg*/ ctx[1] ? 'd-flex' : 'd-none') + " svelte-1x3p768")) {
				attr_dev(svg_1, "class", svg_1_class_value);
			}

			if (dirty & /*hide*/ 1) {
				toggle_class(div1, "transition", /*hide*/ ctx[0]);
			}

			if (dirty & /*hide*/ 1) {
				toggle_class(div2, "hide", /*hide*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			dispose();
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

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Loader', slots, []);
	let hide = false;
	let svg = false;

	function hideLoader() {
		setTimeout(
			() => {
				$$invalidate(1, svg = false);
				$$invalidate(0, hide = true);
			},
			2000
		);
	}

	onMount(() => {
		setTimeout(
			() => {
				$$invalidate(1, svg = true);
			},
			1000
		);
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ onMount, hide, svg, hideLoader });

	$$self.$inject_state = $$props => {
		if ('hide' in $$props) $$invalidate(0, hide = $$props.hide);
		if ('svg' in $$props) $$invalidate(1, svg = $$props.svg);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [hide, svg, hideLoader];
}

class Loader extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css$1);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Loader",
			options,
			id: create_fragment$1.name
		});
	}
}

/* src\App.svelte generated by Svelte v3.49.0 */
const file = "src\\App.svelte";

function add_css(target) {
	append_styles(target, "svelte-1wu6l9", ".svelte-1wu6l9{scroll-behavior:smooth}.content-wrapper.svelte-1wu6l9{perspective:400px;transform-style:preserve-3d}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsIm1hcHBpbmdzIjoibUhBaUNBIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkFwcC5zdmVsdGUiXX0= */");
}

function create_fragment(ctx) {
	let div1;
	let transitions;
	let updating_page;
	let t0;
	let loader;
	let t1;
	let div0;
	let navbar;
	let t2;
	let router;
	let current;

	function transitions_page_binding(value) {
		/*transitions_page_binding*/ ctx[1](value);
	}

	let transitions_props = {};

	if (/*page*/ ctx[0] !== void 0) {
		transitions_props.page = /*page*/ ctx[0];
	}

	transitions = new Transitions({ props: transitions_props, $$inline: true });
	binding_callbacks.push(() => bind(transitions, 'page', transitions_page_binding));
	loader = new Loader({ $$inline: true });

	navbar = new Navbar({
			props: { page: /*page*/ ctx[0] },
			$$inline: true
		});

	router = new Router({
			props: { page: /*page*/ ctx[0] },
			$$inline: true
		});

	const block = {
		c: function create() {
			div1 = element("div");
			create_component(transitions.$$.fragment);
			t0 = space();
			create_component(loader.$$.fragment);
			t1 = space();
			div0 = element("div");
			create_component(navbar.$$.fragment);
			t2 = space();
			create_component(router.$$.fragment);
			attr_dev(div0, "class", "content-wrapper h-full overflow-y-scroll svelte-1wu6l9");
			add_location(div0, file, 19, 2, 497);
			attr_dev(div1, "class", "page-wrapper bg-very-dark svelte-1wu6l9");
			add_location(div1, file, 16, 0, 414);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			mount_component(transitions, div1, null);
			append_dev(div1, t0);
			mount_component(loader, div1, null);
			append_dev(div1, t1);
			append_dev(div1, div0);
			mount_component(navbar, div0, null);
			append_dev(div0, t2);
			mount_component(router, div0, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const transitions_changes = {};

			if (!updating_page && dirty & /*page*/ 1) {
				updating_page = true;
				transitions_changes.page = /*page*/ ctx[0];
				add_flush_callback(() => updating_page = false);
			}

			transitions.$set(transitions_changes);
			const navbar_changes = {};
			if (dirty & /*page*/ 1) navbar_changes.page = /*page*/ ctx[0];
			navbar.$set(navbar_changes);
			const router_changes = {};
			if (dirty & /*page*/ 1) router_changes.page = /*page*/ ctx[0];
			router.$set(router_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(transitions.$$.fragment, local);
			transition_in(loader.$$.fragment, local);
			transition_in(navbar.$$.fragment, local);
			transition_in(router.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(transitions.$$.fragment, local);
			transition_out(loader.$$.fragment, local);
			transition_out(navbar.$$.fragment, local);
			transition_out(router.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_component(transitions);
			destroy_component(loader);
			destroy_component(navbar);
			destroy_component(router);
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
	let page = location.hash.replace('#', '') || 'home';
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	function transitions_page_binding(value) {
		page = value;
		$$invalidate(0, page);
	}

	$$self.$capture_state = () => ({
		Loader,
		Transitions,
		Router,
		Navbar,
		page
	});

	$$self.$inject_state = $$props => {
		if ('page' in $$props) $$invalidate(0, page = $$props.page);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*page*/ 1) {
			location.hash = page;
		}
	};

	return [page, transitions_page_binding];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

function overwrite (node) {
  node.children[0].remove();
  return node
}

const app = new App({
  target: overwrite(document.body)
});

export { app as default };
//# sourceMappingURL=bundle.js.map
