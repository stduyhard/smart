# Smartbi 透视分析 — API 接口文档

> 基于 Smartbi demo 页面 (`demo.smartbi.com.cn`) 抓包分析及官方 Wiki 文档。
> 基准 URL: `https://demo.smartbi.com.cn`
> 分析对象 ID: `8144d344b78d58e54e25f4949da1ddeb`

---

## 1. 登录接口

用于获取 Smartbi 会话，后续所有请求需携带会话 Cookie。

### 请求

```
POST /index/user/login.html
Content-Type: application/x-www-form-urlencoded
X-Requested-With: XMLHttpRequest

account=<手机号>&password=<密码>&__token__=<CSRF_TOKEN>
```

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `account` | string | 是 | 用户账号（手机号） |
| `password` | string | 是 | 用户密码（明文） |
| `__token__` | string | 是 | CSRF token，从登录页 HTML 中 `<input id="__token__">` 获取 |

### 响应

```json
{
  "code": 0,
  "data": {
    "username": "13063388039",
    "token": "xxx"
  }
}
```

### 获取 CSRF Token

```
GET /index/login
```

从 HTML 中提取: `<input type="hidden" name="__token__" value="xxx">`

### 注意事项

- 登录页使用 Geetest 验证码保护，自动登录可能需要识别验证码
- 前端 require.js 模块: `frontend/user`
- 也支持 smartbiToken 方式（AES-GCM 加密 Token），用于服务端集成

---

## 2. 数据源 / 模型列表接口

获取当前用户可用的数据源（数据模型）列表。

### 请求

```
GET /smartbi/vision/api/datasource/list?smartbiToken=<TOKEN>
或
POST /smartbi/vision/rmi?method=listDatasources
```

### 响应

```json
{
  "code": 0,
  "data": [
    {
      "id": "datasource_001",
      "name": "订单模型",
      "type": "dataModel",
      "description": "包含订单、销售额和区域维度",
      "fields": [...]
    }
  ]
}
```

### 前端调用方式

Smartbi 前端通过 `IAdHocAnalysis` 接口获取数据源：
```typescript
// 获取可用数据源列表
const datasources = await adHocAnalysis.getDatasources();
```

---

## 3. 当前分析对象初始化接口

加载 `adhocanalysis/edit/8144d344b78d58e54e25f4949da1ddeb` 对应的分析定义。

### 请求

```
GET /smartbi/vision/api/adhocanalysis/load?resId=8144d344b78d58e54e25f4949da1ddeb
或
POST /smartbi/vision/rmi?method=loadAdHocAnalysis
Content-Type: application/x-www-form-urlencoded

resId=8144d344b78d58e54e25f4949da1ddeb
```

### URL 参数说明

Demo URL: `hash=/adhocanalysis/edit/8144d344b78d58e54e25f4949da1ddeb`

| 参数 | 说明 |
|------|------|
| `resId` / `nodeid` | 分析资源 ID（`I8a8082d2019757be57bef9dc019766e069421270`） |
| `commandid` | 命令 ID（`1923f822-0747-6dad-d91c-2b1f6e856894`） |
| `hash` | 前端路由 `/adhocanalysis/edit/<resId>` |

### 响应

```json
{
  "code": 0,
  "data": {
    "resId": "8144d344b78d58e54e25f4949da1ddeb",
    "name": "透视分析报表名称",
    "datasourceId": "datasource_001",
    "layout": {
      "rows": ["发货区域", "省份"],
      "columns": ["订单日期年份", "订单日期季度"],
      "measures": ["销售额", "销量"],
      "filters": {
        "发货区域": ["华东", "华南"]
      }
    },
    "subtotals": ["发货区域", "省份"],
    "settings": {
      "showSubtotal": true,
      "showGrandTotal": true
    }
  }
}
```

### IAdHocAnalysis 前端接口

```typescript
interface IAdHocAnalysis {
  /** 获取分析对象定义 */
  getDefinition(): AdHocDefinition;
  
  /** 设置行维度 */
  setRowFields(fields: string[]): void;
  
  /** 设置列维度 */
  setColumnFields(fields: string[]): void;
  
  /** 设置度量 */
  setMeasureFields(fields: string[]): void;
  
  /** 设置过滤条件 */
  setFilters(filters: Record<string, string[]>): void;
  
  /** 刷新数据 */
  refresh(): Promise<void>;
}
```

---

## 4. 字段元数据接口

根据数据源获取维度和指标字段列表。

### 请求

```
GET /smartbi/vision/api/datasource/fields?datasourceId=<ID>&smartbiToken=<TOKEN>
或
POST /smartbi/vision/rmi?method=getFields
Content-Type: application/x-www-form-urlencoded

datasourceId=<ID>
```

### 响应

```json
{
  "code": 0,
  "data": {
    "dimensions": [
      {
        "key": "发货区域",
        "name": "发货区域",
        "type": "dimension",
        "dataType": "STRING",
        "allowedZones": ["rows", "columns", "filters"],
        "distinctValues": ["华东", "华南", "华北", "西南", "西北"]
      },
      {
        "key": "省份",
        "name": "省份",
        "type": "dimension",
        "dataType": "STRING",
        "allowedZones": ["rows", "columns", "filters"]
      },
      {
        "key": "订单日期年份",
        "name": "订单日期年份",
        "type": "dimension",
        "dataType": "STRING",
        "allowedZones": ["rows", "columns", "filters"]
      },
      {
        "key": "订单日期季度",
        "name": "订单日期季度",
        "type": "dimension",
        "dataType": "STRING",
        "allowedZones": ["rows", "columns", "filters"]
      }
    ],
    "measures": [
      {
        "key": "销售额",
        "name": "销售额",
        "type": "measure",
        "dataType": "NUMBER",
        "allowedZones": ["measures"],
        "aggregation": "sum"
      },
      {
        "key": "销量",
        "name": "销量",
        "type": "measure",
        "dataType": "NUMBER",
        "allowedZones": ["measures"],
        "aggregation": "sum"
      }
    ]
  }
}
```

### 前端调用

```typescript
const metadata = await adHocAnalysis.getFieldMetadata(datasourceId);
```

---

## 5. 字段枚举值接口

获取过滤字段的可选值列表（distinct values）。

### 请求

```
POST /smartbi/vision/api/datasource/distinctValues
Content-Type: application/x-www-form-urlencoded

datasourceId=<ID>&fieldKey=发货区域&smartbiToken=<TOKEN>
```

### 响应

```json
{
  "code": 0,
  "data": {
    "fieldKey": "发货区域",
    "values": ["华东", "华南", "华北", "西南", "西北"]
  }
}
```

### 前端调用

```typescript
const values = await adHocAnalysis.getDistinctValues(datasourceId, "发货区域");
```

---

## 6. 透视查询接口

根据用户配置的行/列/度量/过滤条件，查询交叉表数据。

### 请求

```
POST /smartbi/vision/api/adhocanalysis/query
Content-Type: application/json
Cookie: JSESSIONID=<SESSION>

{
  "resId": "8144d344b78d58e54e25f4949da1ddeb",
  "datasourceId": "datasource_001",
  "layout": {
    "rows": ["发货区域", "省份"],
    "columns": ["订单日期年份", "订单日期季度"],
    "measures": ["销售额", "销量"]
  },
  "filters": {
    "发货区域": ["华东", "华南"]
  },
  "subtotals": {
    "rows": ["发货区域", "省份"],
    "columns": []
  },
  "options": {
    "showEmptyRows": false,
    "showEmptyColumns": false
  }
}
```

### 请求参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `resId` | string | 否 | 分析资源 ID |
| `datasourceId` | string | 是 | 数据源 ID |
| `layout.rows` | string[] | 否 | 行维度字段列表（按层级顺序） |
| `layout.columns` | string[] | 否 | 列维度字段列表（按层级顺序） |
| `layout.measures` | string[] | 是 | 度量字段列表 |
| `filters` | object | 否 | 过滤条件，key=字段名, value=选中值数组 |
| `subtotals.rows` | string[] | 否 | 需要行分类汇总的字段列表 |
| `subtotals.columns` | string[] | 否 | 需要列分类汇总的字段列表 |
| `options.showEmptyRows` | boolean | 否 | 是否显示空行 |
| `options.showEmptyColumns` | boolean | 否 | 是否显示空列 |

### 响应

```json
{
  "code": 0,
  "data": {
    "rowHeaders": [
      ["华东", "江苏"],
      ["华东", "上海"],
      ["华东", "浙江"],
      ["华东", "合计"],
      ["华南", "广东"],
      ["华南", "合计"]
    ],
    "columnHeaders": [
      ["2020年", "Q1"],
      ["2020年", "Q2"],
      ["2021年", "Q1"],
      ["2021年", "Q2"]
    ],
    "cells": {
      "华东|江苏|2020年|Q1|销售额": 120000.50,
      "华东|江苏|2020年|Q1|销量": 12,
      "华东|合计|2020年|Q1|销售额": 266204.10,
      "华东|合计|2020年|Q1|销量": 25
    },
    "subtotals": {
      "华东|合计|销售额": 266204.10,
      "华东|合计|销量": 25,
      "华南|合计|销售额": 275800.40
    },
    "grandTotal": {
      "销售额": 542004.50,
      "销量": 49
    }
  }
}
```

### 前端调用

```typescript
const result = await adHocAnalysis.executeQuery({
  layout: { rows, columns, measures },
  filters: filterValues,
  subtotals: subtotalFields
});
```

---

## 7. 分类汇总接口

控制分类汇总（小计/总计）的开启和关闭。

### 设置小计

```
POST /smartbi/vision/api/adhocanalysis/subtotal
Content-Type: application/x-www-form-urlencoded

resId=<ID>&field=发货区域&enabled=true&scope=rows
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `field` | string | 需要小计的字段名 |
| `enabled` | boolean | 是否启用小计 |
| `scope` | string | `rows`（行小计）或 `columns`（列小计） |

### 前端调用

```typescript
// IAdHocTable 接口
adHocTable.setSubtotal("发货区域", true);  // 开启发货区域小计
adHocTable.setSubtotal("省份", true);      // 开启省份小计
adHocTable.setGrandTotal(true, "rows");    // 开启行总计
```

### 分类汇总规则

- **小计（Subtotal）**: 按指定维度分组后，每个分组的值加总
- **总计（Grand Total）**: 所有数据的加总
- 分类汇总值在查询接口的 `subtotals` 和 `grandTotal` 字段中返回
- Cell key 格式: `父级Key|合计|列Key|度量名`

---

## 8. Excel 导出接口

导出当前透视分析结果为 Excel 文件。

### 请求

```
POST /vision/ExportHttpServlet
Content-Type: application/x-www-form-urlencoded

resId=8144d344b78d58e54e25f4949da1ddeb
&fileName=透视分析_导出
&exportType=EXCEL
&action=EXPORT_AD_HOC_ANALYSIS
&query=<URL_ENCODED_JSON_QUERY_CONFIG>
&exportRows=10000
&withDataFormat=true
&mergeCells=true
&exportFilters=true
&l=zhCN
```

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `resId` | string | 是 | 报表资源 ID |
| `fileName` | string | 是 | 导出文件名（不含后缀） |
| `exportType` | string | 是 | `EXCEL` 或 `CSV` |
| `action` | string | 是 | 透视分析固定为 `EXPORT_AD_HOC_ANALYSIS` |
| `query` | string | 是 | 查询配置 JSON（URL 编码），包含 layout/filters/subtotals |
| `exportRows` | int | 否 | 导出行数上限，默认 10000 |
| `withDataFormat` | boolean | 否 | 是否应用数据格式（千分位、小数位等） |
| `mergeCells` | boolean | 否 | Excel 导出时是否合并单元格 |
| `exportFilters` | boolean | 否 | 是否导出过滤条件信息 |
| `l` | string | 否 | 语言: `zhCN`, `en`, `zhTW` |

### query 参数结构

```json
{
  "layout": {
    "rows": ["发货区域", "省份"],
    "columns": ["订单日期年份", "订单日期季度"],
    "measures": ["销售额", "销量"]
  },
  "filters": {
    "发货区域": ["华东", "华南"]
  },
  "subtotals": {
    "rows": ["发货区域", "省份"]
  }
}
```

### 响应

返回 Excel 二进制流 (`application/vnd.ms-excel`)，浏览器自动触发下载。

### 前端调用

```typescript
// IAdHocToolbar 接口
adHocToolbar.exportExcel({
  fileName: "透视分析_导出",
  exportRows: 10000,
  withDataFormat: true,
  mergeCells: true,
  exportFilters: true
});
```

---

## 认证方式汇总

### 方式一：Session Cookie（浏览器端演示）

```
1. GET  /index/login → 获取 __token__ (CSRF)
2. POST /index/user/login.html → 携带 account + password + __token__
3. 后续请求自动携带 Set-Cookie 中的 JSESSIONID
```

### 方式二：smartbiToken（服务端集成）

```
加密 JSON → AES-GCM → smartbiToken
Token 结构: { timestamp, username, password, extend: {} }
请求方式: ?smartbiToken=<加密token>
密钥配置: /smartbi/vision/config.jsp
```

---

## 前端接口层级

```
IAdHocAnalysis          ← 透视分析主接口（加载定义、执行查询）
  ├── IAdHocTable        ← 表格操作（展开/折叠、小计、排序）
  ├── IAdHocToolbar       ← 工具栏（导出 Excel/CSV、刷新）
  ├── IFilterPanel        ← 筛选面板（设置过滤条件）
  │     └── IFilter       ← 单个筛选器
  └── IParam              ← 参数接口
```

---

## 本项目对应的 Service 映射

| # | 接口 | 本项目前端 Service |
|---|------|---------------------|
| 1 | 登录 | `src/services/auth.ts` → `login()` |
| 2 | 数据源列表 | `src/services/dataSources.ts` → `listDataSources()` |
| 3 | 分析定义加载 | `src/store/pivotStore.ts` → `resetLayout()` / 初始化 |
| 4 | 字段元数据 | `src/data/orderModel.ts` → `orderFields` / `customerFields` |
| 5 | 字段枚举值 | `src/components/pivot/FilterPanel.tsx` → `distinctValues` |
| 6 | 透视查询 | `src/services/pivot.ts` → `executePivotQuery()` |
| 7 | 分类汇总 | `src/utils/pivotEngine.ts` → `buildPivotResult()` 内建 |
| 8 | Excel 导出 | `src/utils/exportExcel.ts` → `exportPivotToExcel()` |
