import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { evaluate, sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, log, log10, sqrt, pow, factorial, pi, e } from 'mathjs';

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

export function useCalculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('calculator_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveHistory = async (newHistory: HistoryEntry[]) => {
    try {
      await AsyncStorage.setItem('calculator_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const handleInput = (value: string) => {
    let newDisplay = display;

    switch (value) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'sinh':
      case 'cosh':
      case 'tanh':
        newDisplay += `${value}(`;
        break;
      case 'sin⁻¹':
        newDisplay += 'asin(';
        break;
      case 'cos⁻¹':
        newDisplay += 'acos(';
        break;
      case 'tan⁻¹':
        newDisplay += 'atan(';
        break;
      case 'log':
        newDisplay += 'log10(';
        break;
      case 'ln':
        newDisplay += 'log(';
        break;
      case '√':
        newDisplay += 'sqrt(';
        break;
      case 'x²':
        newDisplay += '^2';
        break;
      case 'xʸ':
        newDisplay += '^';
        break;
      case '10ˣ':
        newDisplay += '10^';
        break;
      case 'x!':
        newDisplay += '!';
        break;
      case 'π':
        newDisplay += 'pi';
        break;
      case 'e':
        newDisplay += 'e';
        break;
      case '×':
        newDisplay += '*';
        break;
      case '÷':
        newDisplay += '/';
        break;
      case '%':
        newDisplay += '%';
        break;
      case 'MC':
        setMemory(0);
        return;
      case 'MR':
        newDisplay += memory.toString();
        break;
      case 'M+':
        memoryAdd();
        return;
      case 'M-':
        memorySubtract();
        return;
      default:
        newDisplay += value;
    }

    setDisplay(newDisplay);
    try {
      const evaluated = evaluate(newDisplay.replace(/pi/g, pi.toString()).replace(/e(?![a-z])/g, e.toString()));
      setResult(evaluated.toString());
    } catch (error) {
      setResult(null);
    }
  };

  const calculate = () => {
    if (!display) return;

    try {
      const expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/pi/g, pi.toString())
        .replace(/e(?![a-z])/g, e.toString())
        .replace(/(\d+)!/g, 'factorial($1)');

      const calculatedResult = evaluate(expression);
      const resultString = typeof calculatedResult === 'number' 
        ? calculatedResult.toFixed(10).replace(/\.?0+$/, '')
        : calculatedResult.toString();

      const newEntry: HistoryEntry = {
        expression: display,
        result: resultString,
        timestamp: Date.now(),
      };

      const newHistory = [newEntry, ...history].slice(0, 50);
      setHistory(newHistory);
      saveHistory(newHistory);

      setDisplay(resultString);
      setResult(null);
    } catch (error) {
      setResult('Error');
    }
  };

  const clear = () => {
    setDisplay('');
    setResult(null);
  };

  const deleteLast = () => {
    setDisplay(display.slice(0, -1));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('calculator_history');
  };

  const insertFromHistory = (expression: string) => {
    setDisplay(expression);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('sine') || lowerCommand.includes('sin')) {
      const match = lowerCommand.match(/\d+/);
      if (match) {
        handleInput('sin');
        handleInput(match[0]);
        handleInput(')');
      }
    } else if (lowerCommand.includes('square root')) {
      const match = lowerCommand.match(/\d+/);
      if (match) {
        handleInput('√');
        handleInput(match[0]);
        handleInput(')');
      }
    } else if (lowerCommand.includes('add')) {
      const matches = lowerCommand.match(/\d+/g);
      if (matches && matches.length >= 2) {
        handleInput(matches[0]);
        handleInput('+');
        handleInput(matches[1]);
      }
    } else if (lowerCommand.includes('factorial')) {
      const match = lowerCommand.match(/\d+/);
      if (match) {
        handleInput(match[0]);
        handleInput('x!');
      }
    } else if (lowerCommand.includes('log')) {
      const match = lowerCommand.match(/\d+/);
      if (match) {
        handleInput('log');
        handleInput(match[0]);
        handleInput(')');
      }
    }
  };

  const memoryAdd = () => {
    if (result) {
      setMemory(memory + parseFloat(result));
    }
  };

  const memorySubtract = () => {
    if (result) {
      setMemory(memory - parseFloat(result));
    }
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
  };

  return {
    display,
    result,
    handleInput,
    calculate,
    clear,
    deleteLast,
    history,
    clearHistory,
    insertFromHistory,
    handleVoiceCommand,
    memory,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
  };
}
