import { useEffect, useState } from "react";

// 네이티브 앱 통신을 위한 타입 선언
declare global {
    interface Window {
        Android?: {
            postMessage: (message: string) => void;
        };
        webkit?: {
            messageHandlers?: {
                iOS?: {
                    postMessage: (message: string) => void;
                };
            };
        };
        iOS?: {
            postMessage: (message: string) => void;
        };
        receiveMessageFromApp?: (message: string) => void;
        // 앱에서 주입하는 설정 객체
        appConfig?: {
            userId?: string;
            token?: string;
            apiUrl?: string;
            [key: string]: string | undefined;
        };
    }
}

export function useNativeApp() {
    const [receivedMsg, setReceivedMsg] = useState("");
    const [isWebView, setIsWebView] = useState(false);
    const [appConfig, setAppConfig] = useState<Record<string, string>>({});

    // WebView 환경 확인 및 앱 설정 로드
    useEffect(() => {
        const checkWebView = () => {
            const hasNativeApp = !!(
                window.Android ||
                window.webkit?.messageHandlers?.iOS ||
                window.iOS
            );
            setIsWebView(hasNativeApp);

            // 앱에서 주입한 설정 로드
            if (window.appConfig) {
                setAppConfig(window.appConfig as Record<string, string>);
            }

            // URL 파라미터에서 설정 로드
            const urlParams = new URLSearchParams(window.location.search);
            const urlConfig: Record<string, string> = {};
            urlParams.forEach((value, key) => {
                urlConfig[key] = value;
            });

            if (Object.keys(urlConfig).length > 0) {
                setAppConfig((prev) => ({ ...prev, ...urlConfig }));
            }
        };

        checkWebView();
    }, []);

    // 앱에서 오는 메시지 수신
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.data && typeof event.data === "string") {
                setReceivedMsg(event.data);
            }
        }

        window.addEventListener("message", handleMessage);

        // 네이티브 앱에서 직접 호출하는 함수 등록
        window.receiveMessageFromApp = (message: string) => {
            setReceivedMsg(message);
        };

        return () => {
            window.removeEventListener("message", handleMessage);
            delete window.receiveMessageFromApp;
        };
    }, []);

    // 웹에서 앱으로 메시지 전송
    const sendMessageToApp = (message: string) => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return false;

        // Android (Kotlin) - Android 객체 호출
        if (window.Android && window.Android.postMessage) {
            window.Android.postMessage(trimmedMessage);
            return true;
        }
        // iOS (Swift) - webkit.messageHandlers 호출
        else if (window.webkit?.messageHandlers?.iOS) {
            window.webkit.messageHandlers.iOS.postMessage(trimmedMessage);
            return true;
        }
        // iOS (Swift) - 직접 함수 호출
        else if (window.iOS && window.iOS.postMessage) {
            window.iOS.postMessage(trimmedMessage);
            return true;
        } else {
            alert("앱(안드로이드나 iOS) 환경이 아닙니다.");
            return false;
        }
    };

    return {
        receivedMsg,
        isWebView,
        appConfig,
        sendMessageToApp,
        clearReceivedMsg: () => setReceivedMsg(""),
    };
}
