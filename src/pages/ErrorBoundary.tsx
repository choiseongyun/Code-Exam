import React, { Component, ReactNode } from 'react';
import ErrorPage from './ErrorPage';

// 상태(State) 타입을 정의합니다. 현재는 오류가 발생했는지 여부를 나타내는 boolean 타입의 hasError만 가지고 있습니다.
interface State {
    hasError: boolean;
}

// React.PropsWithChildren<{}>는 자식 컴포넌트(children)가 있는 props를 나타내는 타입입니다.
// State는 위에서 정의한 인터페이스를 사용합니다.
class ErrorBoundary extends Component<React.PropsWithChildren<{}>, State> {
    // 상태를 초기화합니다. 처음에는 오류가 발생하지 않았으므로 hasError는 false입니다.
    state: State = { hasError: false };

    // 오류가 발생했을 때 리액트에 의해 자동으로 호출되는 메소드입니다.
    // 이 메소드에서 발생한 오류를 상태에 저장하여, 렌더링할 때 오류 페이지를 표시하도록 합니다.
    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    // 오류를 캐치하고 콘솔에 오류와 오류 정보를 출력하는 메소드입니다.
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Uncaught error:", error, errorInfo);
    }

    // 컴포넌트를 렌더링하는 메소드입니다.
    // 만약 오류가 발생했다면 ErrorPage를 렌더링하고, 그렇지 않다면 자식 컴포넌트를 렌더링합니다.
    render(): ReactNode {
        if (this.state.hasError) {
            return <ErrorPage />;
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
