import React from 'react';
import { Chip, IconButton, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DetailTable from './DetailTable';
import { getCellValue } from './ComparisonTable';

function ComparisonRow({ scenario, visibleColumns, onRemove, onToggleExpand }) {
  const { id, inputs, result, expanded } = scenario;
  const { investment } = result;

  const diff = investment.renterNetWorth - investment.buyerNetWorth;
  const buyerWin = diff < 0;
  const winnerLabel = buyerWin ? '買房勝' : '租房+投資勝';
  const winnerColor = buyerWin ? 'primary' : 'success';

  return (
    <>
      <TableRow hover>
        {visibleColumns.map((col) => {
          if (col.key === 'winner') {
            return (
              <TableCell key={col.key} align="center">
                <Chip label={winnerLabel} color={winnerColor} size="small" />
              </TableCell>
            );
          }
          if (col.key === 'actions') {
            return (
              <TableCell key={col.key} align="center">
                <IconButton size="small" onClick={() => onToggleExpand(id)}>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onRemove(id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            );
          }
          return (
            <TableCell key={col.key} align={col.align}>
              {getCellValue(col.key, scenario)}
            </TableCell>
          );
        })}
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={visibleColumns.length} sx={{ bgcolor: 'grey.50', p: 2 }}>
            <DetailTable monthly={investment.monthly} loanYears={inputs.loanYears} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default ComparisonRow;
