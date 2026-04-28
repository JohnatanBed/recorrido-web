function Hotspot({ 
    className, 
    position = { top: '50%', left: '50%' }, 
    onClick, 
    title, 
    ariaLabel 
}) {
    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            style={{ 
                top: position.top, 
                left: position.left 
            }}
            aria-label={ariaLabel}
            title={title}
        />
    );
}

export default Hotspot;
