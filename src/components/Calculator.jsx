import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiDelete, FiDivide, FiMinus, FiPlus, FiX as FiMultiply } from 'react-icons/fi';

const Calculator = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState(null);
  const [operation, setOperation] = useState(null);

  const handleNumber = (num) => {
    setDisplay(display === '0' ? String(num) : display + num);
  };

  const handleOperator = (op) => {
    if (operation && previous) {
      calculate();
    }
    setPrevious(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const calculate = () => {
    const current = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '*': result = previous * current; break;
      case '/': result = previous / current; break;
      default: return;
    }
    setDisplay(String(result));
    setPrevious(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperation(null);
  };

  const handleDelete = () => {
    setDisplay(display.length === 1 ? '0' : display.slice(0, -1));
  };

  if (!isOpen) return null;

  const buttons = [
    ['C', '⌫', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const getButtonClass = (btn) => {
    const isOperator = '+-*/'.includes(btn);
    const isEqual = btn === '=';
    return `h-12 sm:h-14 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md
      ${isEqual 
        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700' 
        : isOperator 
          ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900'
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 w-full max-w-xs sm:max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
              <FiPlus className="w-4 h-4 text-white" />
            </div>
            Calculator
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 mb-4 text-right shadow-inner">
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-wider">{display}</p>
          {operation && (
            <p className="text-sm text-primary-600 mt-1">
              {previous} {operation}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {buttons.flat().map((btn) => (
            <motion.button
              key={btn}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '⌫') handleDelete();
                else if (btn === '=') calculate();
                else if ('+-*/'.includes(btn)) handleOperator(btn);
                else handleNumber(btn);
              }}
              className={getButtonClass(btn)}
            >
              {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Calculator;