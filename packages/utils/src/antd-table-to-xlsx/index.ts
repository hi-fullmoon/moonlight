import ExcelJS, { Column } from 'exceljs';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { ColumnGroupType, ColumnType, ColumnsType, TableProps } from 'antd/es/table';

function isGroupColumn<T = any>(column: ColumnGroupType<T> | ColumnType<T>): column is ColumnGroupType<T> {
  return (column as ColumnGroupType<T>).children && (column as ColumnGroupType<T>).children.length > 0;
}

function getColumnWidth(column: ColumnsType[number], currentWidth = 1) {
  if (!isGroupColumn(column)) {
    return 1;
  }
  for (let col of column.children) {
    currentWidth = getColumnWidth(col, currentWidth) + 1;
  }
  return currentWidth;
}

function getParentColumns(columns: ColumnsType, target: ColumnsType[number]) {
  let result: ColumnsType = [];

  function backtracking(cols: ColumnsType, path: ColumnsType = []) {
    for (let c of cols) {
      if (c === target) {
        result = path.slice();
        return;
      }

      if (isGroupColumn(c)) {
        path.push(c);
        backtracking(c.children, path);
        path.pop();
      }
    }
  }

  backtracking(columns);

  return result;
}

function getAllLeafColumns(columns: ColumnsType) {
  const result: ColumnType<any>[] = [];

  function loop(columns: ColumnsType) {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (isGroupColumn(column)) {
        loop(column.children);
      } else {
        result.push(column);
      }
    }
  }
  loop(columns);

  return result;
}

function traversalAntdTableColumns(columns: ColumnsType) {
  if (!columns) {
    return {
      headerData: [] as string[][],
      merges: [] as [number, number, number, number][],
    };
  }

  const result: ColumnsType[] = [];
  const leafColumns: ColumnType<any>[] = [];

  const merges: [number, number, number, number][] = [];

  // column 的坐标 row，相对于二维数组
  const rMap = new Map<ColumnsType[number], number>();
  // column 的坐标 col，相对于二维数组
  const cMap = new Map<ColumnsType[number], number>();
  // column 的宽度，column 可能有 children
  const widthMap = new Map<ColumnsType[number], number>();
  // column 的相对索引，针对于同一个父级
  const indexMap = new Map<ColumnsType[number], number>();

  let level = -1;
  const queue: ColumnsType = [...columns];

  while (queue.length > 0) {
    level++;
    result.push([...queue]);

    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const column = queue.shift();

      rMap.set(column!, level);
      widthMap.set(column!, getColumnWidth(column!));

      // 第一层，相对索引的确定
      if (level === 0) {
        indexMap.set(column!, i);
      }

      if (isGroupColumn(column!)) {
        queue.push(...column.children);

        for (let i = 0; i < column.children.length; i++) {
          indexMap.set(column.children[i], i);
        }
      } else {
        leafColumns.push(column!);
      }
    }
  }

  // 矫正第一行 column 的索引，和各自的 children 有关系
  for (let i = 1; i < result[0].length; i++) {
    const curr = result[0][i];
    const prev = result[0][i - 1];

    const prevIndex = indexMap.get(prev) ?? 0;
    const prevWidth = widthMap.get(prev) ?? 1;

    indexMap.set(curr, prevIndex + prevWidth);
  }

  const rowCount = result.length;
  const colCount = result[0]!.map((column) => getColumnWidth(column)).reduce((a, b) => a + b, 0);
  const headerData: string[][] = new Array(rowCount).fill(null).map(() => new Array(colCount).fill(''));

  for (let row of result) {
    for (let col of row) {
      const r = rMap.get(col);
      const i = indexMap.get(col);
      const parents = getParentColumns(columns, col);
      const c = parents.map((p) => indexMap.get(p)).reduce((a, b) => a! + b!, i);
      cMap.set(col, c!);
      headerData[r!][c!] = col.title as string;
    }
  }

  // 表头水平方向的单元格合并
  widthMap.forEach((value, k) => {
    if (value > 1) {
      const r = rMap.get(k) as number;
      const w = widthMap.get(k) as number;
      const c = cMap.get(k) as number;
      merges.push([r + 1, c + 1, r + 1, c + 1 + w - 1]);
    }
  });

  // 表头竖直方向的单元格合并
  leafColumns.forEach((column) => {
    const r = rMap.get(column) as number;
    const c = cMap.get(column) as number;
    if (r < result.length - 1) {
      merges.push([r + 1, c + 1, result.length - 1 + 1, c + 1]);
    }
  });

  return { headerData, merges };
}

export async function antdTableToBuffer(columns: ColumnsType, dataSource: TableProps['dataSource']) {
  if (!columns || columns.length === 0) {
    throw new Error('The columns parameter cannot be empty.');
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const { headerData, merges } = traversalAntdTableColumns(columns);
  const headerColumns = getAllLeafColumns(columns);

  worksheet.columns = headerColumns.map((column, index) => {
    return {
      key: column.dataIndex,
      width: 20,
      header: headerData.map((row) => row[index]),
      style: {
        alignment: {
          vertical: 'middle',
        },
      },
    } as Partial<Column>;
  });

  worksheet.addRows([...dataSource]);

  merges.forEach((merge) => worksheet.mergeCells(...merge));

  return await workbook.xlsx.writeBuffer();
}

interface SaveAsXlsxOptions {
  columns?: ColumnsType;
  dataSource?: TableProps['dataSource'];
  filename?: string;
}

export async function saveAsXlsx({ columns = [], dataSource = [], filename = '未命名.xlsx' }: SaveAsXlsxOptions) {
  try {
    const buffer = await antdTableToBuffer(columns, dataSource);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  } catch (error) {
    console.error(error);
  }
}

interface SaveAsZipOptions {
  filename?: string;
  items: SaveAsXlsxOptions[];
}

export async function saveAsZip({ filename, items }: SaveAsZipOptions) {
  try {
    const resultZip = new PizZip();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { filename, columns = [], dataSource = [] } = item;
      const buffer = await antdTableToBuffer(columns, dataSource);
      resultZip.file(filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`, buffer);
    }
    const blobData = resultZip.generate({ type: 'blob' });
    saveAs(blobData, filename.endsWith('.zip') ? filename : filename + '.zip');
  } catch (error) {
    console.error(error);
  }
}
