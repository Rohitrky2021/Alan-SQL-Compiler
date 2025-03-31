interface EnhancedChartProps {
  data: any[];
}

interface HeaderProps {
  loadTime: number | null;
}

interface QueryInfoProps {
  isCollapsed?: boolean;
}

interface Query {
  id: string;
  name: string;
  category: string;
  description: string;
  sql: string;
  created: string;
  lastRun: string;
  results: any[] | null;
}

interface HistoryItem {
  id: string;
  name: string;
  sql: string;
  timestamp: string;
}

interface QueryContextType {
  queries: Query[];
  currentQuery: Query;
  queryHistory: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  selectQuery: (id: string) => void;
  setCurrentQuery: (query: Query) => void;
  executeQuery: () => void;
  clearHistory: () => void;
  rerunHistoryQuery: (id: string) => void;
}

interface Query {
  id: string;
  name: string;
  category: string;
  description: string;
  sql: string;
  created: string;
  lastRun: string;
  results: any[] | null;
}
