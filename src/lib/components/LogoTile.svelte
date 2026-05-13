<script lang="ts">
  interface Props {
    glyph: string;
    hue?: number;
    size?: number;
  }

  let { glyph, hue = 30, size = 36 }: Props = $props();
</script>

<div
  class="logo-tile"
  style="
    width:{size}px;height:{size}px;
    background:radial-gradient(circle at 30% 30%, oklch(0.85 0.14 {hue}), oklch(0.7 0.15 {hue}) 60%, oklch(0.4 0.1 {hue}));
    font-size:{size * 0.36}px;
  "
>
  {glyph.slice(0, 2).toUpperCase()}
</div>
