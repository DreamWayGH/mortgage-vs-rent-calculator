import React from 'react';
import { TextField, Tooltip } from '@mui/material';

/**
 * 通用數字輸入欄位（包裝 MUI TextField）
 * @param {{label:string, field:string, values:object, onChange:Function, step?:number, helperText?:string, tooltip?:string}} props
 */
export default function NumberField({ label, field, values, onChange, step, helperText, tooltip }) {
  const textField = (
    <TextField
      label={label}
      type="number"
      size="small"
      value={values[field] ?? ''}
      onChange={onChange(field)}
      inputProps={{ step: step ?? 1, min: 0 }}
      helperText={helperText}
    />
  );

  if (!tooltip) return textField;

  return (
    <Tooltip
      title={tooltip}
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      placement="bottom"
    >
      {textField}
    </Tooltip>
  );
}
