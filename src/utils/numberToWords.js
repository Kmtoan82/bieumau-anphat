const defaultNumbers = 'không một hai ba bốn năm sáu bảy tám chín';
const chuSo = defaultNumbers.split(' ');
const tien = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

function docBlock(so, dayDu) {
  let chuoi = '';
  let tram = Math.floor(so / 100);
  so = so % 100;
  if (dayDu || tram > 0) {
    chuoi = ' ' + chuSo[tram] + ' trăm';
    chuoi += docHangChuc(so, true);
  } else {
    chuoi = docHangChuc(so, false);
  }
  return chuoi;
}

function docHangChuc(so, dayDu) {
  let chuoi = '';
  let chuc = Math.floor(so / 10);
  let donVi = so % 10;
  if (chuc > 1) {
    chuoi = ' ' + chuSo[chuc] + ' mươi';
    if (donVi === 1) chuoi += ' mốt';
    else if (donVi === 5) chuoi += ' lăm';
    else if (donVi !== 0) chuoi += ' ' + chuSo[donVi];
  } else if (chuc === 1) {
    chuoi = ' mười';
    if (donVi === 5) chuoi += ' lăm';
    else if (donVi !== 0) chuoi += ' ' + chuSo[donVi];
  } else if (dayDu && donVi > 0) {
    chuoi = ' lẻ ' + chuSo[donVi];
  } else if (donVi > 0) {
    chuoi = ' ' + chuSo[donVi];
  }
  return chuoi;
}

export function numberToWordsVN(so) {
  if (so === 0 || !so || isNaN(so)) return 'Không đồng chẵn.';
  if (so < 0) return 'Âm ' + numberToWordsVN(Math.abs(so));
  let chuoi = '';
  let hauto = '';
  let ty = '';
  do {
    ty = so % 1000000000;
    so = Math.floor(so / 1000000000);
    if (so > 0) {
      chuoi = docTy(ty, true) + hauto + chuoi;
    } else {
      chuoi = docTy(ty, false) + hauto + chuoi;
    }
    hauto = ' tỷ';
  } while (so > 0);
  
  let result = chuoi.trim();
  // fix trailing spaces or double spaces
  result = result.replace(/\s+/g, ' ');
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng chẵn.';
  }
  return result;
}

function docTy(so, dayDu) {
  let chuoi = '';
  let hauto = '';
  for (let i = 0; i < 3; i++) {
    let m = so % 1000;
    so = Math.floor(so / 1000);
    if (so > 0) {
      chuoi = docBlock(m, true) + hauto + chuoi;
    } else if (m > 0 || dayDu) {
      chuoi = docBlock(m, dayDu) + hauto + chuoi;
    }
    hauto = tien[i + 1];
  }
  return chuoi;
}
