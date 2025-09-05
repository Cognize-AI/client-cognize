"use client";
import React, { useEffect, useRef } from "react";
import styles from "./ApiManagement.module.scss";
import { Copy, Delete, Key } from "@/components/icons";
import { useApiStore } from "@/provider/api-store-provider";
import { axios_instance } from "@/lib/axios";
import toast from "react-hot-toast";

const ApiManagement = () => {
  const apiKey = useApiStore((state) => state.apiKey);
  const setApiKey = useApiStore((state) => state.setApiKey);

  const textRef = useRef<HTMLDivElement>(null);

  const getApiKey = async () => {
    axios_instance
      .get("/key/")
      .then((response) => {
        setApiKey(response.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching API key:", error);
      });
  };

  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.innerText);
      toast.success('Copied!');
    }
  };

  useEffect(() => {
    getApiKey();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.icon}>
          <Key width={20} height={20} fill="none" />
        </div>
        <div className={styles.text} ref={textRef}>
          {apiKey?.key || "No API Key Generated Yet"}
        </div>
        <div className={styles.actions}>
          {/* <div className={styles.delete}>
            <Delete width={20} height={20} fill="#F77272" />
          </div> */}
          <div className={styles.copy} onClick={handleCopy}>
            <Copy width={20} height={20} fill="none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiManagement;
