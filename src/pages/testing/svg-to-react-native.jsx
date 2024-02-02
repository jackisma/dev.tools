import { useCallback, useState } from "react";
import BabelWorker from "@workers/babel.worker";
import { SvgConverter } from "../../components/SvgConverter.jsx";
import { defaultNativeSettings, formFields, nativeRequiredSettings } from "../../constants/svgoConfig.js";
import isSvg from "is-svg";
import { getWorker } from "../../utils/workerWrapper.js";
import SvgoWorker from "../../../typings";
// import { Transformer } from "@components/ConversionPanel";
import SvgrWorker from "../../../typings";

let svgo, _babelWorker, svgr;

export default function SvgToReactNative() {
    const name = "SVG to React Native";
    const [settings, setSettings] = useState(defaultNativeSettings);
    const [optimizedValue, setOptimizedValue] = useState("");

    const transformer = useCallback(
        async ({ value }) => {
            if (!isSvg(value)) throw new Error("This is not a valid svg code.");

            svgo = svgo || getWorker(SvgoWorker);
            svgr = svgr || getWorker(SvgrWorker);

            let _value = await svgo.send({
                value,
                settings: {
                    ...(settings.optimizeSvg ? settings : {}),
                    ...nativeRequiredSettings,
                },
            });

            // set optimized value in state to be used by preview.
            setOptimizedValue(_value);

            _babelWorker = _babelWorker || getWorker(BabelWorker);

            _value = await svgr.send({
                native: true,
                value: _value,
            });

            return _value;
        },
        [settings]
    );

    return (
        <>
            <SvgConverter
                settings={settings}
                setSettings={setSettings}
                transformer={transformer}
                babelWorker={BabelWorker}
                name={name}
                resultTitle={"React Native"}
                formFields={formFields(defaultNativeSettings)}
                optimizedValue={optimizedValue}
            />
        </>
    );
}
