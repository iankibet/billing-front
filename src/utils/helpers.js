import { shRepo } from '@iankibetsh/shframework'

export const formatStatus = (status) => {
  const success = ['paid', 'complete', 'success', 'verified', 'active', 'current', 'closed'];
  const pending = ['pending', 'waiting', 'processing', 'assigned', 'new'];
  const info = ['escalated', 'assigned', 'working', 'assigned'];
  const failed = ['failed', 'incomplete', 'rejected', 'cancelled', 'expired', 'canceled', 'deleted', 'suspended'];

  status = (status || '').toLowerCase().trim();

  let res = '';

  if (success.includes(status)) {
    res = `<span class="text-success d-flex align-items-center"><span class="dot bg-success"></span>${status}</span>`;
  } else if (pending.includes(status)) {
    res = `<span class="text-info d-flex align-items-center"><span class="dot  bg-info"></span>${status}</span>`;
  } else if (failed.includes(status)) {
    res = `<span class="text-danger d-flex align-items-center"><span class="dot bg-danger"></span>${status}</span>`;
  }else if (info.includes(status)) {
    res = `<span class="text-info d-flex align-items-center"><span class="dot bg-info"></span>${status}</span>`;
  }else{
    res = (status)
  }
  return res;

}

export const formatPriority = (priority) => {
  const high = ['high', 'urgent', 'important'];
  const normal = ['normal', 'medium'];
  const low = ['low', 'minor', 'low'];

  priority = (priority || '').toLowerCase().trim();

  let res = '';

  if (high.includes(priority)) {
    res = `<span class="badge bg-danger">${priority}</span>`;
  } else if (normal.includes(priority)) {
    res = `<span class="bg-warning badge">${priority}</span>`;
  } else if (low.includes(priority)) {
    res = `<span class="  badge bg-info px-2">${priority}</span>`;
  }else{
    res = (priority);
  }
  return res;
}

export const formatDate = (dt, format) =>{
  if(!dt) return '';
  if(!format) format = 'DD/MM/YYYY HH:mm';
  return shRepo.formatDate(dt, format);
}
export const formatDateTime = (dt) =>{
  if(!dt) return '--';
  const date = new Date(dt);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}

export const trimString = (str, len) => {
  if (!str) return '';
  if(!len) len = 20;
  const words = str.split(' ');
  const trimmedText = words.slice(0, len).join(' ');
  return words.length > len ? trimmedText + '...' : trimmedText;
}

export const formatAnyDate = (dt, format) => {
  return shRepo.formatDate(dt, format);
}

export const sortedCurrentSlots = (records, type) => {
  return records.slice().sort((a, b) => {
    if (a.is_current === 'yes') return -1;
    if (b.is_current === 'yes') return 1;
    if(type === 'rounds')
      return a.round_number - b.round_number;
    if(type === 'circles')
      return a.circle_number - b.circle_number;
  });
}

export const normalDateTime = date => {
  return shRepo.formatDate(date, 'DD-MM-YYYY  H:mm')
}
export const normalDate= date => {
  return shRepo.formatDate(date, 'DD-MM-YYYY')
}

export const formatAmount = (amount) => {
  if (!amount || amount  === 0) {
    return 0.0;
  }
  const amt = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (!amt.includes('.')) {
    // amt += '.0';
  }
  return amt;
};

export const numberFormat = (amount) => {
  if (!amount || amount  === 0) {
    return 0.0;
  }
  const amt = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (!amt.includes('.')) {
    // amt += '.0';
  }
  return amt;
};

