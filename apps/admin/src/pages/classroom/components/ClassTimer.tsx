import { Tag } from "antd";
import React, { useEffect, useState } from "react";

const formatElapsed = (ms: number): string => {
    // Clamped: a browser clock running behind the server's would go negative.
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const pad = (n: number) => String(n).padStart(2, "0");
    return [Math.floor(totalSeconds / 3600), Math.floor(totalSeconds / 60) % 60, totalSeconds % 60].map(pad).join(":");
};

/**
 * Time since the class started, the same for everyone in it. Its own component
 * so the once-a-second tick doesn't re-render the page around it.
 */
const ClassTimer: React.FC<{ startedAt: string }> = ({ startedAt }) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    return <Tag style={{ fontVariantNumeric: "tabular-nums" }}>{formatElapsed(now - new Date(startedAt).getTime())}</Tag>;
};

export default ClassTimer;
