import Popper from 'popper.js';
import MobileDetect from 'mobile-detect';

const GUTTER = 5,
      detect = new MobileDetect(window.navigator.userAgent),
      IS_MOBILE = !!(detect.mobile() || detect.tablet());

export default {
  properties: {
    range: {
      type: Object,
      value: null,
      observer: 'hoverOverRange'
    },

    mobile: {
      type: Boolean,
      reflectToAttribute: true,
      value: IS_MOBILE
    }
  },

  attached() {
    let getRect = () => {
      if (this.range) {
        return this.range.getBoundingClientRect();
      }

      return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
    };

    this._popper = new Popper({
      getBoundingClientRect() {
        return getRect();
      },

      get clientWidth() {
        return getRect().width;
      },

      get clientHeight() {
        return getRect().height;
      }
    }, this, {
      placement: 'top',
      modifiers: { offset: { offset: `0,${GUTTER}` } }
    });
  },

  hoverOverRange(range) {
    this.hidden = !range;

    if (!range || IS_MOBILE) {
      return;
    }

    if (this._popper) {
      this._popper.scheduleUpdate();
    }
  }
}
