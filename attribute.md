# 属性说明

## 列属性
- w: 宽度
## 行属性
- h: 高度

## 单元格属性
```typescript
interface Cell {
  v?: string; // 值
  t?: string; // 显示值
  f?: string; // 公式 formula
  b?: 1 | 0; // 粗体
  i?:  1 | 0; // 斜体
  u?:  1 | 0; // 下划线
  hta?: 'left' | 'center' | 'right',
  bc?: string; // 背景色
  fc?: string; // 字体颜色
  fs?: string; // 字号
  ff?: string; // 字体
}
```

