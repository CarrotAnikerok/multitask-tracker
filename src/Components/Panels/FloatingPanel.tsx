import React, { useEffect, useRef, useState } from 'react'

type FloatingPanelProps = {
    children: React.ReactNode;
    content: (close: () => void) => React.ReactNode; 
    className?: string;
}

export default function FloatingPanel({children, content, className}: FloatingPanelProps) {
    const [isPanel, setPanel] = useState(false);
    const panelRef = useRef(null);
    const triggerRef = useRef(null);

    const toggleVisibility = () => {
        setPanel(!isPanel);
    };

    useEffect(() => {
        const handleClickOutside = (event: PointerEvent) => {
            const panelElem: HTMLElement = panelRef.current!;
            const triggerElem: HTMLElement= triggerRef.current!;

            if (
                panelElem && 
                !panelElem.contains(event.target as Node) &&
                !triggerElem.contains(event.target as Node)
            ) {
                setPanel(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
            return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            };
    }, []);


    return (
        <div className={className}>
            <button ref={triggerRef} className="panel-trigger" onClick={toggleVisibility}>{children}</button>
            {isPanel 
            ? <div ref={panelRef} className='floating-panel'>{content(() => setPanel(false))}</div>
            : null
            }
        </div>
    )
}
