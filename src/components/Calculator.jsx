import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiDelete } from 'react-icons/fi';

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
      case '×': result = previous * current; break;
      case '÷': result = previous / current; break;
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Calculator</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4 text-right">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{display}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['C', '⌫', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn) => (
            <motion.button
              key={btn}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '⌫') handleDelete();
                else if (btn === '=') calculate();
                else if ('+-×÷'.includes(btn)) handleOperator(btn);
                else handleNumber(btn);
              }}
              className={`h-12 rounded-lg font-semibold transition-colors ${
                '+-×÷='.includes(btn)
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {btn}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Calculator;