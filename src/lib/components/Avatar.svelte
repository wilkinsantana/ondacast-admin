<script lang="ts">
  interface Props {
    name: string;
    hue?: number;
    size?: number;
  }

  let { name, hue = 30, size = 26 }: Props = $props();

  const initials = $derived(
    name.split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase()
  );
</script>

<span
  class="av"
  style="
    width:{size}px;height:{size}px;
    background:radial-gradient(circle at 30% 30%, oklch(0.85 0.14 {hue}), oklch(0.7 0.15 {hue}) 60%, oklch(0.4 0.1 {hue}));
    font-size:{size * 0.4}px;
  "
>
  {initials}
</span>
