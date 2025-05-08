
export interface Investment {
  tipo_inversion: string;
  nombre: string;
  porcentaje: number;
  rentabilidad_esperada: number;
  ingreso_mensual: number;
  descripcion: string;
  ventajas: string[];
  desventajas: string[];
}

export interface Scenario {
  nombre_escenario: string;
  nivel_riesgo: string;
  inversion_total: number;
  inversiones: Investment[];
  explicacion: string;
  pasos_a_seguir: string[];
  tiempo_recomendado: string;
  objetivo: string;
}

export interface Comparison {
  nombre_escenario: string;
  nivel_riesgo: string;
  ganancia_total: number;
  ingreso_mensual: number;
  recomendado: boolean;
  razon_recomendacion: string;
}

export interface MarketData {
  tendencias?: string;
  oportunidades?: string;
  riesgos?: string;
  retos?: string;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}

export interface FinanceData {
  escenarios?: Scenario[];
  comparaciones?: Comparison[];
  analisis_mercado?: MarketData;
  recomendaciones?: Record<string, string>;
  preguntas_frecuentes?: FAQ[];
  consejos_practicos?: string[];
}
