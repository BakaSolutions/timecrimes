<template>
  <span class="time timer fix-width">
    <span v-if="value">
      T{{ time.plus ? '+' : '-' }}
    </span>
    <span v-else>-</span>
    <span v-if="time.y">
      {{ time.years }}y
    </span>
    <span v-if="time.d">
      {{ time.days }}d
    </span>
    <span v-if="time.h">
      {{ time.h }}h
    </span>
    <span v-if="time.m">
      {{ time.m }}m
    </span>
    <span v-if="(withSeconds || !time.m) && time.s">
      {{ time.s }}s
    </span>
  </span>
</template>

<script>
export default {
  props: {
    date: {
      required: true
    },
    withSeconds: {}
  },
  data() {
    return {
      value: null
    }
  },
  mounted() {
    this.intervalId = setInterval(this.tick, 1000);
    this.tick();
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  computed: {
    timestamp() {
      return +new Date(this.date);
    },
    time() {
      let plus = this.value > 0;
      let s = Math.abs(this.value);
      let y = s / (86400 * 365);
      let d = (y % 1) * 365;
      let h = (d % 1) * 24;
      let m = (h % 1) * 60;
      s = Math.round((m % 1) * 60);

      y = Math.floor(y);
      d = Math.floor(d);
      h = Math.floor(h);
      m = Math.floor(m);
      return {
        plus, y, d, h, m, s,
        years: String(y),
        days: String(d),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(Math.round(s)).padStart(2, '0')
      }
    }
  },
  methods: {
    tick() {
      this.value = Math.floor((new Date() - this.timestamp) / 1000);
    },
  }
};
</script>

<style>
.time {
  width: var(--timer-width);
}
.timer {
  text-align: center;
}
</style>