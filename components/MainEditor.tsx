//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import $ from "jquery";
import katex from "katex";
import "katex/dist/katex.min.css";
import "mathquill/build/mathquill.css";
import "mathquill4quill/mathquill4quill.css";

// https://katex.org/
if (typeof window !== "undefined") {
  window.katex = katex;
  window.jQuery = window.$ = $;
  const mathquill4quill = require("mathquill4quill");
  require("mathquill/build/mathquill.js");
}

const FORMAT_OPERATORS = [
  ["\\pm", "\\pm"],
  ["\\sqrt{x}", "\\sqrt"],
  ["\\sqrt[3]{x}", "\\sqrt[3]{}"],
  ["\\sqrt[n]{x}", "\\nthroot"],
  ["\\frac{x}{y}", "\\frac"],
  ["\\sum^{s}_{x}{d}", "\\sum"],
  ["\\prod^{s}_{x}{d}", "\\prod"],
  ["\\coprod^{s}_{x}{d}", "\\coprod"],
  ["\\int^{s}_{x}{d}", "\\int"],
  ["\\binom{n}{k}", "\\binom"],
];

const MainEditor = ({
  height,
  defaultValue,
  onChange,
}: {
  height?: number;
  defaultValue?: string;
  onChange?: (e: string) => void;
}) => {
  // The div containing the quill editor when no instance of Editable is using it.
  // The div that contains the quill toolbar.
  const quillToolbarContainer = useRef(null);
  // The quill editor
  const quillEditorContainer = useRef(null);
  // The quill instance
  const quillInstance = useRef(null);
  // The data for each Editable, that is also persisted in local storage
  // Derive a list of editables from the editables object

  /**
   * Instansiate the quill editor, using the quillEditorContainer as
   * the element for it. Also, use our own toolbar.
   */
  useEffect(() => {
    // Store the quill instance for future use
    quillEditorContainer.current.innerHTML = defaultValue;
    quillInstance.current = new Quill(quillEditorContainer.current, {
      theme: "snow",
      modules: {
        toolbar: {
          container: quillToolbarContainer.current,
        },
        formula: true,
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Add event listeners to quill to update the active editable
   * when we type into the quill editor.
   */
  useEffect(() => {
    if (quillInstance.current) {
      const quill = quillInstance.current;

      const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });
      enableMathQuillFormulaAuthoring(quill, {
        operators: FORMAT_OPERATORS,
      });

      const getText = () => {
        onChange && onChange(quill.root.innerHTML);
      };

      quill.on("text-change", getText);
      return () => quill.off("text-change", getText);
    }
  }, [onChange, quillInstance]);

  return (
    <>
      <div ref={quillToolbarContainer}>
        <div className="ql-formats">
          <select className="ql-header">
            <option value="false"></option>
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
          </select>
        </div>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-direction" value="rtl"></button>
          <select className="ql-align"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          {/* <button className="ql-image"></button>
          <button className="ql-video"></button> */}
          <button className="ql-formula"></button>
        </span>
      </div>
      <div
        ref={quillEditorContainer}
        style={{
          height: 100,
        }}
      ></div>
    </>
  );
};

export default React.memo(MainEditor);
