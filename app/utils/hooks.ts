import { useEffect, useMemo, useState } from "react";
import { useAccessStore, useAppConfig } from "../store";
import { collectModelsWithDefaultModel } from "./model";

export function useAllModels() {
  const accessStore = useAccessStore();
  const configStore = useAppConfig();
  const models = useMemo(() => {
    return collectModelsWithDefaultModel(
      configStore.models,
      [configStore.customModels, accessStore.customModels].join(","),
      accessStore.defaultModel,
    );
  }, [
    accessStore.customModels,
    accessStore.defaultModel,
    configStore.customModels,
    configStore.models,
  ]);

  return models;
}

export function useDarkMode() {
  // 创建一个 state 来保存当前的暗黑模式状态
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 初始值根据系统的当前设置
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // 媒体查询
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    // 定义事件处理函数
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    // 监听媒体查询的变化
    mediaQuery.addEventListener("change", handleChange);

    // 清理函数
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isDarkMode;
}
