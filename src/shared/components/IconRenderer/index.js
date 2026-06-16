import React from 'react';
import {
  FaArrowDown,
  FaArrowRotateRight,
  FaArrowUpFromBracket,
  FaBook,
  FaBoxOpen,
  FaBrain,
  FaBolt,
  FaChartColumn,
  FaChessKnight,
  FaCheck,
  FaClipboardList,
  FaCoins,
  FaCrosshairs,
  FaCircleCheck,
  FaCircleInfo,
  FaCircleQuestion,
  FaCircleXmark,
  FaDumbbell,
  FaEye,
  FaEyeSlash,
  FaFire,
  FaGear,
  FaHandPointer,
  FaHeart,
  FaHourglassHalf,
  FaMagnifyingGlass,
  FaMapPin,
  FaMask,
  FaPencil,
  FaPlus,
  FaPuzzlePiece,
  FaScroll,
  FaShield,
  FaShieldHalved,
  FaSkullCrossbones,
  FaTowerObservation,
  FaTrash,
  FaTriangleExclamation,
  FaUser,
  FaUserSecret,
  FaUsers,
  FaWandSparkles,
} from 'react-icons/fa6';
import { FaHeartBroken, FaMapMarkedAlt, FaTimes } from 'react-icons/fa';

const ICON_MAP = {
  '👥': FaUsers,
  '👤': FaUser,
  '🧙': FaUserSecret,
  '✅': FaCircleCheck,
  '🚫': FaCircleXmark,
  '⏳': FaHourglassHalf,
  '📊': FaChartColumn,
  '🎲': FaChessKnight,
  '🧮': FaChartColumn,
  '💰': FaCoins,
  '🔍': FaMagnifyingGlass,
  '⚔️': FaChessKnight,
  '🛡️': FaShieldHalved,
  '👹': FaSkullCrossbones,
  '📍': FaMapPin,
  '🖥️': FaTowerObservation,
  '🎮': FaCircleInfo,
  '🔐': FaShield,
  '📦': FaBoxOpen,
  '⚙️': FaGear,
  '📭': FaCircleQuestion,
  '✨': FaWandSparkles,
  '💀': FaSkullCrossbones,
  '💥': FaTriangleExclamation,
  '🗺️': FaMapMarkedAlt,
  '🧩': FaPuzzlePiece,
  '🎒': FaBoxOpen,
  '📜': FaScroll,
  '🎭': FaMask,
  '📚': FaBook,
  '🔄': FaArrowRotateRight,
  '🎯': FaCrosshairs,
  '👆': FaHandPointer,
  '💡': FaCircleInfo,
  '🎉': FaCircleCheck,
  '📥': FaArrowDown,
  '📤': FaArrowUpFromBracket,
  '🟢': FaCircleCheck,
  '🔴': FaCircleXmark,
  '⚪': FaCircleQuestion,
  '☠️': FaSkullCrossbones,
  '🦴': FaSkullCrossbones,
  '💔': FaHeartBroken,
  '🧠': FaBrain,
  '💪': FaDumbbell,
  '❤️': FaHeart,
  '💜': FaHeart,
  '💚': FaHeart,
  '⚡': FaBolt,
  '🔥': FaFire,
  '👁️': FaEye,
  '🙈': FaEyeSlash,
  '✗': FaTimes,
  '✓': FaCheck,
  '✕': FaTimes,
  '➕': FaPlus,
  '✏️': FaPencil,
  '🗑️': FaTrash,
  '📋': FaClipboardList,
  '🛡': FaShieldHalved,
};

const ICON_ALIAS_MAP = {
  users: FaUsers,
  user: FaUser,
  wizard: FaUserSecret,
  check: FaCircleCheck,
  ban: FaCircleXmark,
  hourglass: FaHourglassHalf,
  chart: FaChartColumn,
  dice: FaChessKnight,
  coins: FaCoins,
  search: FaMagnifyingGlass,
  sword: FaChessKnight,
  shield: FaShieldHalved,
  skull: FaSkullCrossbones,
  map: FaMapMarkedAlt,
  pin: FaMapPin,
  tower: FaTowerObservation,
  info: FaCircleInfo,
  lock: FaShield,
  box: FaBoxOpen,
  settings: FaGear,
  empty: FaCircleQuestion,
  sparkles: FaWandSparkles,
  warning: FaTriangleExclamation,
  puzzle: FaPuzzlePiece,
  scroll: FaScroll,
  mask: FaMask,
  book: FaBook,
  rotate: FaArrowRotateRight,
  target: FaCrosshairs,
  pointer: FaHandPointer,
  upload: FaArrowUpFromBracket,
  download: FaArrowDown,
  success: FaCircleCheck,
  error: FaCircleXmark,
  heart: FaHeart,
  brokenHeart: FaHeartBroken,
  brain: FaBrain,
  strength: FaDumbbell,
  fire: FaFire,
  eye: FaEye,
  hidden: FaEyeSlash,
  add: FaPlus,
  edit: FaPencil,
  trash: FaTrash,
  clipboard: FaClipboardList,
};

function splitLabelIcon(text) {
  if (typeof text !== 'string') {
    return { icon: null, label: text };
  }

  const trimmed = text.trim();
  const aliasMatch = trimmed.match(/^\[\[([a-z-]+)\]\]\s*/i);
  if (aliasMatch) {
    return {
      icon: aliasMatch[1].toLowerCase(),
      label: trimmed.slice(aliasMatch[0].length).trim(),
    };
  }

  const emojiMatch = trimmed.match(/^(\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u);
  if (!emojiMatch) {
    return { icon: null, label: text };
  }

  return {
    icon: emojiMatch[0].trim(),
    label: trimmed.slice(emojiMatch[0].length).trim(),
  };
}

export function renderIcon(icon, props = {}) {
  if (!icon) return null;

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, props);
  }

  if (typeof icon === 'string') {
    const IconComponent = ICON_ALIAS_MAP[icon] || ICON_MAP[icon] || FaCircleQuestion;
    return <IconComponent {...props} />;
  }

  return null;
}

export function renderIconLabel(value, props = {}) {
  const { icon, label } = splitLabelIcon(value);

  if (!icon) {
    return value;
  }

  return (
    <span className={props.className || 'icon-label'} style={props.style}>
      {renderIcon(icon, { className: props.iconClassName })}
      <span>{label}</span>
    </span>
  );
}

export function iconFromText(value, props = {}) {
  const { icon } = splitLabelIcon(value);
  return renderIcon(icon, props);
}
