"use client";
import { useState } from "react";
import { useNativeApp } from "./hooks/useNativeApp";

export default function WebviewTest() {
    const [inputMsg, setInputMsg] = useState("");
    const { receivedMsg, isWebView, sendMessageToApp, appConfig } =
        useNativeApp();

    // 웹에서 앱으로 메시지 전송
    function handleSendMessage() {
        const success = sendMessageToApp(inputMsg);
        if (success) {
            alert("메시지 전송 완료");
        }
        setInputMsg("");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* 헤더 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h1 className="text-xl font-bold text-gray-800 text-center">
                    네이티브 앱 ↔ 웹뷰 통신 테스트
                </h1>
                <p className="text-sm text-gray-600 text-center mt-1">
                    코틀린/스위프트 앱과 웹 간 메시지 송수신
                </p>
            </div>

            {/* 앱 설정 정보 */}
            {Object.keys(appConfig).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                        앱에서 전달받은 설정
                    </h2>
                    <div className="space-y-2">
                        {Object.entries(appConfig).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                            >
                                <span className="text-sm font-medium text-gray-600">
                                    {key}:
                                </span>
                                <span className="text-sm text-gray-800">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 메시지 전송 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    앱으로 메시지 보내기
                </h2>
                <div className="space-y-3">
                    <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-gray-600"
                        type="text"
                        value={inputMsg}
                        onChange={(e) => setInputMsg(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        maxLength={100}
                    />
                    <button
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-base hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleSendMessage}
                        disabled={!inputMsg.trim()}
                    >
                        메시지 전송
                    </button>
                </div>
            </div>

            {/* 메시지 수신 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    앱에서 받은 메시지
                </h2>
                <div className="min-h-[80px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {receivedMsg ? (
                        <div className="text-gray-800 text-base break-words">
                            {receivedMsg}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-base italic">
                            아직 받은 메시지가 없습니다
                        </div>
                    )}
                </div>
            </div>

            {/* 상태 표시 */}
            <div className="mt-4 text-center">
                {isWebView ? (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        네이티브 앱 연결됨
                    </div>
                ) : (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        웹 브라우저 환경
                    </div>
                )}
            </div>

            {/* 개발 가이드 */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    네이티브 앱 연동 가이드
                </h3>
                <div className="text-xs text-blue-700 space-y-1">
                    <p>
                        <strong>Android (Kotlin):</strong>{" "}
                        window.Android.postMessage(message)
                    </p>
                    <p>
                        <strong>iOS (Swift):</strong>{" "}
                        window.webkit.messageHandlers.iOS.postMessage(message)
                    </p>
                    <p>
                        <strong>웹에서 메시지 받기:</strong>{" "}
                        window.receiveMessageFromApp(message) 함수 호출
                    </p>
                </div>
            </div>
        </div>
    );
}
