"use client"
import React from "react"
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "./utils"

export interface ExpandableButtonProps {
  expanded?: boolean
  onExpandedChange?: (open: boolean) => void
}

export function ExpandableSponsorButton({
  expanded: expandedProp,
  onExpandedChange: setExpandedProp,
  className,
  ...props
}: HTMLMotionProps<"div"> & ExpandableButtonProps) {
  const [_expanded, _setExpanded] = React.useState(false)
  const expanded = expandedProp ?? _expanded

  const setExpanded = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const expandedState = typeof value === "function" ? value(expanded) : value
      if (setExpandedProp) {
        setExpandedProp(expandedState)
      } else {
        _setExpanded(expandedState)
      }
    },
    [setExpandedProp, expanded],
  )

  const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    setExpanded(true)
  }

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setExpanded(false)
  }

  return (
    <motion.div
      layout
      onClick={!expanded ? onClickHandler : undefined}
      className={cn(
        "react-sp-container",
        expanded ? "react-sp-form-expanded" : "react-sp-button-collapsed",
        className
      )}
      initial={false}
      animate={{
        backgroundColor: expanded ? "#ffffff" : "rgba(255,255,255,0)",
        color: expanded ? "#000000" : "#ffffff",
        borderRadius: expanded ? "8px" : "0px"
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.6
      }}
      style={{
        border: expanded ? 'none' : '1px solid rgba(255, 255, 255, 0.35)',
        cursor: expanded ? 'default' : 'pointer'
      }}
      {...props}
    >
      {/* Collapsed Text */}
      <motion.span
        layout
        initial={false}
        animate={{ opacity: expanded ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: expanded ? "absolute" : "relative",
          pointerEvents: expanded ? "none" : "auto",
          whiteSpace: "nowrap"
        }}
      >
        SPONSOR US
      </motion.span>

      {/* Expanded Form */}
      <motion.div
        layout
        initial={false}
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: expanded ? "relative" : "absolute",
          pointerEvents: expanded ? "auto" : "none",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div className="react-sp-form-header">
          <h3 className="react-sp-form-title">Sponsor Team Trinetra</h3>
          <button
            onClick={handleClose}
            className="react-sp-close-btn"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields (Landscape Grid) */}
        <div className="react-sp-form-fields">
          <div className="react-sp-field-row">
            <label className="react-sp-label">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="react-sp-input"
            />
          </div>

          <div className="react-sp-field-row">
            <label className="react-sp-label">Company</label>
            <input
              type="text"
              placeholder="Company / Institution"
              className="react-sp-input"
            />
          </div>

          <div className="react-sp-field-row react-sp-full-width">
            <label className="react-sp-label">Email</label>
            <input
              type="email"
              placeholder="contact@company.com"
              className="react-sp-input"
            />
          </div>

          <div className="react-sp-field-row react-sp-full-width">
            <label className="react-sp-label">Message</label>
            <textarea
              placeholder="Tell us about your interest..."
              rows={3}
              className="react-sp-textarea"
            />
          </div>

          <button
            type="button"
            className="react-sp-submit-btn react-sp-full-width"
          >
            Send Inquiry
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
