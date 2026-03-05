import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
    IoIosCheckmarkCircle,
    IoIosHourglass,
    IoIosWarning,
} from "react-icons/io";
import { MdError } from "react-icons/md";
import { RiProhibited2Line } from "react-icons/ri";

type SubmitStatus =
    | "success"
    | "error"
    | "invalid"
    | "empty"
    | "cooldown"
    | "limit"
    | null;

const HOURLY_LIMIT = 10;
const COOLDOWN_MS = 60_000;
const CONTACT_BODY_FONT_SIZE = {
    xs: "0.95rem",
    sm: "1rem",
    md: "1.05rem",
    lg: "1.1rem",
    xl: "1.2rem",
    xxl: "1.45rem",
    xxxl: "1.8rem",
};

const ContactForm = () => {
    const { t } = useTranslation();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [status, setStatus] = useState<SubmitStatus>(null);

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(null);

        const form = formRef.current;
        if (!form) {
            return;
        }

        const name =
            (form.elements.namedItem("user_name") as HTMLInputElement | null)?.value
                .trim() ?? "";
        const email =
            (form.elements.namedItem("user_email") as HTMLInputElement | null)?.value
                .trim() ?? "";
        const message =
            (form.elements.namedItem("message") as HTMLTextAreaElement | null)?.value
                .trim() ?? "";
        const botField =
            (form.elements.namedItem("bot_field") as HTMLInputElement | null)?.value
                .trim() ?? "";

        if (botField) {
            setStatus("error");
            return;
        }

        if (!emailRegex.test(email)) {
            setStatus("invalid");
            return;
        }

        if (message.length < 5) {
            setStatus("empty");
            return;
        }

        const now = Date.now();
        const hourAgo = now - 3_600_000;
        const lastSend = Number(localStorage.getItem("last_send_time")) || 0;
        const storedCount = Number(localStorage.getItem("hourly_count")) || 0;
        const sentCount = lastSend < hourAgo ? 0 : storedCount;

        if (lastSend && now - lastSend < COOLDOWN_MS) {
            setStatus("cooldown");
            return;
        }

        if (sentCount >= HOURLY_LIMIT) {
            setStatus("limit");
            return;
        }

        try {
            const res = await fetch("https://api.wpowertech.ro/sendemail.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    bot: botField,
                }),
            });

            if (!res.ok) {
                setStatus("error");
                return;
            }

            setStatus("success");
            localStorage.setItem("last_send_time", String(now));
            localStorage.setItem("hourly_count", String(sentCount + 1));
            form.reset();
        } catch (error) {
            console.error("Send email function error:", error);
            setStatus("error");
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: {
                    xs: "100%",
                    sm: "30rem",
                    md: "32rem",
                    lg: "36rem",
                    xl: "42rem",
                    xxl: "48rem",
                    xxxl: "54rem",
                },
                backgroundColor: "#FFFFFF",
                color: "#000000",
                borderRadius: 0,
                boxShadow: "none",
                marginLeft: 0,
                marginRight: 0,
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    fontFamily: "Stack Sans Headline, sans-serif",
                    fontWeight: 700,
                    color: "#000000",
                    fontSize: {
                        xs: "1.8rem",
                        sm: "1.9rem",
                        md: "2rem",
                        lg: "3rem",
                        xl: "4rem",
                        xxl: "5rem",
                        xxxl: "6rem",
                    },
                }}
            >
                Contact Form
            </Typography>

            <form ref={formRef} onSubmit={sendEmail}>
                <input
                    type="text"
                    name="bot_field"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                <TextField
                    fullWidth
                    label={t("contact.form.name")}
                    name="user_name"
                    variant="outlined"
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            borderRadius: 0,
                        },
                        "& .MuiInputBase-input": {
                            fontSize: CONTACT_BODY_FONT_SIZE,
                        },
                        "& .MuiInputLabel-root": {
                            fontSize: CONTACT_BODY_FONT_SIZE,
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label={t("contact.form.email")}
                    name="user_email"
                    type="email"
                    required
                    variant="outlined"
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            borderRadius: 0,
                        },
                        "& .MuiInputBase-input": {
                            fontSize: CONTACT_BODY_FONT_SIZE,
                        },
                        "& .MuiInputLabel-root": {
                            fontSize: CONTACT_BODY_FONT_SIZE,
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label={t("contact.form.message")}
                    name="message"
                    multiline
                    rows={5}
                    required
                    variant="outlined"
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            borderRadius: 0,
                        },
                        "& .MuiInputBase-input": {
                            fontSize: CONTACT_BODY_FONT_SIZE,
                        },
                        "& .MuiInputLabel-root": {
                            fontSize: CONTACT_BODY_FONT_SIZE,
                        },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: "#000000",
                        color: "#FFFFFF",
                        borderRadius: 0,
                        fontFamily: "Figtree, sans-serif",
                        fontSize: CONTACT_BODY_FONT_SIZE,
                        "&:hover": {
                            backgroundColor: "#222222",
                        },
                    }}
                >
                    {t("contact.form.submit")}
                </Button>
            </form>

            <AnimatePresence mode="wait">
                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            color: "#0f5132",
                            fontFamily: "Figtree, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        <IoIosCheckmarkCircle size={16} /> Message sent successfully!
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            color: "#B00020",
                            fontFamily: "Figtree, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        <MdError size={16} />Something went wrong. Try again later.
                    </motion.div>
                )}

                {status === "invalid" && (
                    <motion.div
                        key="invalid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            color: "#B00020",
                            fontFamily: "Figtree, sans-serif",
                        }}
                    >
                        <IoIosWarning size={16} /> Please enter a valid email.
                    </motion.div>
                )}

                {status === "empty" && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            color: "#B00020",
                            fontFamily: "Figtree, sans-serif",
                        }}
                    >
                        <IoIosWarning size={16} /> Message cannot be empty.
                    </motion.div>
                )}

                {status === "cooldown" && (
                    <motion.div
                        key="cooldown"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            color: "#8A6D3B",
                            fontFamily: "Figtree, sans-serif",
                        }}
                    >
                        <IoIosHourglass size={16} /> Cool down! You can send a message every 60 seconds.
                    </motion.div>
                )}

                {status === "limit" && (
                    <motion.div
                        key="limit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "1rem",
                            color: "#8A6D3B",
                            fontFamily: "Figtree, sans-serif",
                        }}
                    >
                        <RiProhibited2Line size={16} /> You reached the hourly limit (5 messages). Try again later.
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default ContactForm;

