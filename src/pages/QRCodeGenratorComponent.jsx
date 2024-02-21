import { useState } from "react";
import QRCode from "react-qr-code";

export default function QrCodeGeneratorComponent() {
    const [qrText, setQrText] = useState("https://www.google.com/");

    const handleTextChange = (input) => {
        setQrText(input);
    };

    const onImageDownload = () => {
        const svg = document.getElementById("QRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            const borderSize = 10;
            const borderColor = "#ffffff";

            canvas.width = img.width + 2 * borderSize;
            canvas.height = img.height + 2 * borderSize;

            ctx.fillStyle = borderColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const xPosition = (canvas.width - img.width) / 2;
            const yPosition = (canvas.height - img.height) / 2;
            ctx.drawImage(img, xPosition, yPosition);

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "QRCode";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };

        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    const tailwindcss = {
        main: "flex flex-col gap-4 m-4",
        p: "font-bold text-sm mb-2 text-white",
        inputDiv: "flex gap-2",
        input: "px-4 py-2 w-full block rounded-lg border-0 bg-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        copyBtn: "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        qrDiv: "mt-5 flex gap-5 items-end",
        qrCode: "flex border-white border-8",
        qrDownloadBtn: "h-11 rounded-md mt-4 bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
    }

    return (
        <main className={tailwindcss.main}>
            <div>
                <p className={tailwindcss.p}>Text: </p>
                <div className={tailwindcss.inputDiv}>
                    <input
                        className={tailwindcss.input}
                        value={qrText}
                        onChange={(e) => handleTextChange(e.currentTarget.value)}
                    />
                    <button
                        type="button"
                        className={tailwindcss.copyBtn}
                        onClick={async () => {
                            await navigator.clipboard.writeText(qrText);
                        }}
                    >
                        Copy
                    </button>
                </div>
                {qrText && (
                    <div className={tailwindcss.qrDiv}>
                        <div className={tailwindcss.qrCode}>
                            <QRCode
                                size={256}
                                bgColor="white"
                                fgColor="black"
                                viewBox={`0 0 256 256`}
                                value={qrText}
                                id="QRCode"
                            />
                        </div>
                        <button
                            type="button"
                            className={tailwindcss.qrDownloadBtn}
                            onClick={onImageDownload}
                        >
                            Download
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
