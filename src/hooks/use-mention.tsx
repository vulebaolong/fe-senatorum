// useMention.ts
"use client";
import { useGetNameUser } from "@/api/tantask/user.tanstack";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import Name from "@/components/name/name";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";

type MentionUser = { id: string | number; username?: string; name?: string; avatar?: string };

type UseMentionOptions = {
    trigger?: string; // mặc định "@"
    limit?: number; // số item gợi ý
    externalRef?: RefObject<HTMLTextAreaElement | null>; // 👈 ref có sẵn của bạn
    popupClassName?: string;
    popupStyle?: CSSProperties;
    getDisplay?: (u: MentionUser) => string;
    renderItem?: (u: MentionUser, active: boolean) => React.ReactNode;
    // (tuỳ chọn) controlled mode
    value?: string;
    onValueChange?: (v: string) => void;
};

export function useMention(opts?: UseMentionOptions) {
    const {
        trigger = "@",
        limit = 8,
        externalRef,
        popupClassName,
        popupStyle,
        getDisplay = (u: any) => u.name || u.username || "",
        value: controlledValue,
        onValueChange,
    } = opts || {};

    // nếu có externalRef thì dùng nó, không thì dùng internalRef
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaRef = externalRef ?? internalRef;

    const [uncontrolledValue, setUncontrolledValue] = useState("");
    const value = controlledValue ?? uncontrolledValue;
    const setValue = onValueChange ?? setUncontrolledValue;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const [debouncedQuery] = useDebouncedValue(query, 300);

    const usersQuery = useGetNameUser({
        pagination: { page: 1, pageSize: limit },
        filters: { name: debouncedQuery },
        sort: { sortBy: "createdAt", isDesc: true },
        enabled: !!debouncedQuery,
    });

    const list: MentionUser[] = useMemo(() => (usersQuery.data as MentionUser[]) || [], [usersQuery.data]);
    
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const computeCaretPosition = useCallback((el: HTMLTextAreaElement) => {
        const { selectionEnd } = el;
        const cs = window.getComputedStyle(el);
        const mirror = document.createElement("div");
        const caret = document.createElement("span");

        Object.assign(mirror.style, {
            position: "absolute",
            visibility: "hidden",
            zIndex: "-9999",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            boxSizing: cs.boxSizing,
            width: `${el.clientWidth}px`,
            padding: cs.padding,
            border: cs.border,
            font: cs.font,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
        } as CSSProperties);

        mirror.textContent = el.value.substring(0, selectionEnd);
        caret.textContent = "\u200b";
        mirror.appendChild(caret);
        document.body.appendChild(mirror);

        const caretRect = caret.getBoundingClientRect();
        const mRect = mirror.getBoundingClientRect();
        const taRect = el.getBoundingClientRect();
        const x = taRect.left + (caretRect.left - mRect.left);
        const y = taRect.top + (caretRect.top - mRect.top) + 20; // hạ popup 1 chút

        document.body.removeChild(mirror);
        return { x, y };
    }, []);

    const extractQuery = useCallback(
        (text: string, caret: number) => {
            const left = text.slice(0, caret);
            const re = new RegExp(`${escapeRegExp(trigger)}([\\w\\d_]{0,30})$`);
            const m = left.match(re);
            return m ? m[1] : null;
        },
        [trigger]
    );

    // === handlers để gắn vào <Textarea> của bạn ===
    const onChangeMention = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const el = e.currentTarget;
            const v = el.value;
            setValue(v);

            const q = extractQuery(v, el.selectionStart);
            if (q !== null) {
                setQuery(q);
                setOpen(!!q.length);
                setActiveIndex(0);
                setAnchor(computeCaretPosition(el));
            } else {
                setOpen(false);
                setQuery("");
                setAnchor(null);
            }
        },
        [computeCaretPosition, extractQuery, setValue]
    );

    const onKeyDownMention = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (!open || !list.length) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => (i + 1) % list.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => (i - 1 + list.length) % list.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                const u = list[activeIndex];
                if (u) insertMention(getDisplay(u));
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        },
        [open, list, activeIndex, getDisplay]
    );

    const insertMention = useCallback(
        (display: string) => {
            const el = textareaRef.current;
            if (!el) return;
            const caret = el.selectionStart;
            const before = value.slice(0, caret);
            const after = value.slice(caret);
            const re = new RegExp(`${escapeRegExp(trigger)}[\\w\\d_]*$`);
            const replacedBefore = before.replace(re, `${trigger}${display} `);
            const next = replacedBefore + after;

            setValue(next);
            setOpen(false);
            setQuery("");
            setAnchor(null);

            requestAnimationFrame(() => {
                el.focus();
                const pos = replacedBefore.length;
                el.setSelectionRange(pos, pos);
            });
        },
        [textareaRef, value, trigger, setValue]
    );

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const el = textareaRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
        };
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, [open, textareaRef]);

    const popup = useMemo(() => {
        if (!open || !anchor || !list.length) return null;

        const style: CSSProperties = {
            position: "fixed",
            left: anchor.x,
            top: anchor.y,
            zIndex: 9999,
            width: 260,
            maxHeight: 240,
            overflowY: "auto",
            background: "white",
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            padding: 4,
            ...popupStyle,
        };

        return createPortal(
            <div style={style} className={popupClassName}>
                {list.map((user, idx) => {
                    return (
                        <div
                            key={String(user.id) + idx}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => insertMention(getDisplay(user))}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
                                idx === activeIndex ? "bg-muted" : "hover:bg-muted"
                            }`}
                        >
                            <AvatartImageCustom
                                className="h-8 w-8 rounded-full cursor-pointer"
                                nameFallback={user.name}
                                nameRouterPush={user.username}
                                src={user.avatar}
                            />
                            <Name name={user.name || "??"} username={user.username || "??"} />
                        </div>
                    );
                })}
                {usersQuery.isFetching && <div className="px-2 py-1 text-xs opacity-60">Đang tải...</div>}
            </div>,
            document.body
        );
    }, [open, anchor, list, activeIndex, getDisplay, insertMention, popupClassName, popupStyle, usersQuery.isFetching]);

    // props bạn gắn vào <Textarea>
    const mentionHandlers = {
        onChange: onChangeMention,
        onKeyDown: onKeyDownMention,
    } as const;

    return {
        // gắn thẳng vào Textarea của bạn (KHÔNG trả ref, vì bạn đã có sẵn ref)
        mentionHandlers,
        popup,
        value, // nếu bạn muốn controlled từ ngoài thì truyền value/onValueChange vào options
        setValue,
        open,
        query,
    };
}
