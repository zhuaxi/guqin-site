# Guqin Notation Starter V2

这是一个更接近 MVP 的古琴打谱前端原型，基于 React + TypeScript + Zustand + SVG。

## 已包含

- 左侧工具栏
- 中间打谱画布
- 右侧属性面板
- 点击落音
- 选中与修改音
- 删除所选音
- 标准谱 / 教学谱 / 艺术谱 三种视图切换
- 本地保存与读取（localStorage）
- JSON 导入导出
- 基础播放高亮 + WebAudio 简易发声
- 清空谱面

## 启动

```bash
npm install
npm run dev
```

## 关键文件

- `src/store/useEditorStore.ts`：编辑器状态
- `src/components/EditorCanvas.tsx`：谱面渲染与点击创建
- `src/components/Header.tsx`：保存 / 导入导出 / 播放
- `src/utils/audio.ts`：基础播放逻辑

## 建议下一步

1. 加拖拽移动 Note
2. 加多选 / 框选
3. 接后端 API 保存项目
4. 增加真正的古琴采样音色
5. 导出 PDF / 图片
