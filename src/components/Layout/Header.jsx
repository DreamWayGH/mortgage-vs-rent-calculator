import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

// 頁面標題列
function Header() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          房貸 vs 租房+投資 比較計算機
        </Typography>
        {/* 預留：深色模式切換、圖表切換按鈕（未來擴充） */}
        <Box />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
