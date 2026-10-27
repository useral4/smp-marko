import Image, { type ImageProps } from "next/image";

const installationSources = [480, 768, 1280, 1600]
  .map((width) => `/images/service-install-${width}.webp ${width}w`)
  .join(", ");

// Keep the existing IMG position in the DOM so saved visual-editor selectors
// continue to work. Static variants also work without Next's image optimizer.
export default function ResponsiveImage(props: ImageProps) {
  if (props.src !== "/service-install.jpeg") return <Image {...props} />;

  const {
    alt, fill, width, height, style, className, sizes, priority, loading,
    onClick, onLoad, onError, id, title,
  } = props;
  return <img
    id={id}
    title={title}
    alt={alt}
    src="/images/service-install-1600.webp"
    srcSet={installationSources}
    sizes={sizes === "33vw"
      ? "(max-width: 900px) 100vw, 33vw"
      : sizes === "50vw"
        ? "(max-width: 900px) 100vw, 50vw"
        : sizes || "(max-width: 900px) 100vw, 50vw"}
    width={fill ? undefined : width}
    height={fill ? undefined : height}
    className={className}
    style={{
      ...(fill ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        inset: 0,
      } : {}),
      ...style,
    }}
    loading={priority ? "eager" : loading || "lazy"}
    decoding="async"
    fetchPriority={priority ? "high" : undefined}
    onClick={onClick}
    onLoad={onLoad}
    onError={onError}
  />;
}
