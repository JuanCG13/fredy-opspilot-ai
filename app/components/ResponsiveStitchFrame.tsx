type ResponsiveStitchFrameProps = {
  src: string;
  title: string;
  label?: string;
};

export function ResponsiveStitchFrame({ src, title, label = title }: ResponsiveStitchFrameProps) {
  return (
    <main className="stitch-export-shell" aria-label={label}>
      <iframe src={src} title={title} className="stitch-export-frame" />
    </main>
  );
}
