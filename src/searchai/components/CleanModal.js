import * as React from 'react';
import { X, Sparkles } from 'lucide-react';

export const CleanModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100000,
            background: '#F9F9F9', display: 'flex', flexDirection: 'column',
        }}>
            {/* Header bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 48px', height: '48px', background: '#FFFFFF',
                borderBottom: '1px solid #F2F2F2', flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} style={{ color: '#D62E2F' }} />
                    <span style={{
                        fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                        fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.28px',
                        color: '#2D2A29',
                    }}>
                        Coresight Research
                        <span style={{ fontWeight: 400, color: '#888888', marginLeft: '6px' }}>| AI Search</span>
                    </span>
                </div>
                <button
                    onClick={onClose}
                    title="Close"
                    style={{
                        width: '24px', height: '24px', border: 'none', background: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#B3B3B3', padding: 0, margin: 0,
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </div>
    );
};

export default CleanModal;
