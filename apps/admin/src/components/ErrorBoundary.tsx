import React from "react";
import { logger } from "../lib/logger";
import { Button, Result } from "antd";


type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        logger.error("unhandled render error",
            {
                message: error.message,
                componentStack: info.componentStack
            }
        );
    }
    render() {
        if (this.state.hasError) {
            return (<Result
                status="500"
                title="Something went wrong"
                extra={<Button type="primary" onClick={() => window.location.assign("/")}>Back home</Button>}></Result>)
        }
        return this.props.children;
    }
}
