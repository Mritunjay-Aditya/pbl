export default function BIcon({ name, className, center = false, ...props }) {
    const centerStyle = center ? "flex justify-center items-center" : "text-center";
    return <i className={`${centerStyle} bi bi-${name} ${className}`} {...props}></i>;
}