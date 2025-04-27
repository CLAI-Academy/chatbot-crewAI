import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface InvestmentScenario {
  id: string;
  name: string;
  riskLevel: string;
  amount: string;
  allocation: string;
  duration: string;
  milestones: string;
  returnRate: string;
  dividends: string;
  totalReturn: string;
  projectedValue: string;
  assetType: string;
  ticker: string;
  passiveIncome: string;
  references: string;
}

interface ParsedInvestmentReport {
  title: string;
  executiveSummary: string;
  scenarios: InvestmentScenario[];
  comparison: string;
  riskAnalysis: string;
  recommendations: string;
}

interface InvestmentReportProps {
  content: string;
}

const InvestmentReport: React.FC<InvestmentReportProps> = ({ content }) => {
  // Extract markdown content between ```markdown and ```
  const markdownMatch = content.match(/```markdown([\s\S]*?)```/);
  const markdownContent = markdownMatch ? markdownMatch[1] : content;

  // Detectar si el contenido es ya un formato de tarjeta procesado (formato no markdown)
  const isAlreadyProcessed =
    content.includes("Escenarios de Inversión") &&
    content.includes("Retorno esperado") &&
    !content.includes("```");

  // Parse sections from the markdown
  const sections = useMemo((): ParsedInvestmentReport => {
    // Limpiamos el contenido para eliminar líneas de cabecera de tabla que aparecen como texto
    const cleanedContent = markdownContent.replace(
      /## Comparación de Escenarios \|.*\|\s*\|/g,
      "## Comparación de Escenarios"
    );

    // Parse title
    const titleMatch = cleanedContent.match(/# ([^\n]+)/);
    const title = titleMatch ? titleMatch[1] : "";

    // Parse executive summary
    const summaryMatch = cleanedContent.match(
      /## Resumen Ejecutivo\s*([\s\S]*?)(?=---)/
    );
    const executiveSummary = summaryMatch ? summaryMatch[1].trim() : "";

    // Parse scenarios from table rows
    const scenarios: InvestmentScenario[] = [];

    // Find the table header to identify column positions
    const headerMatch = cleanedContent.match(
      /\| (?:Identificación del Escenario|Escenario) \|.*\|/
    );
    if (headerMatch) {
      // Get all table rows (excluding header and separator rows)
      const tableContentMatch = cleanedContent.match(
        /(\| Escenario \d+.*\|)(?:\r?\n)*/g
      );

      if (tableContentMatch) {
        tableContentMatch.forEach((row) => {
          // Clean up and split the row
          const rowData = row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell); // Remove empty cells

          // Only process if we have enough data
          if (rowData.length >= 5) {
            const scenario: InvestmentScenario = {
              id: rowData[0].replace("Escenario ", ""),
              name: rowData[1] || "",
              riskLevel: rowData[2] || "",
              amount: rowData[3] || "",
              allocation: rowData[4] || "",
              duration: rowData[5] || "",
              milestones: rowData[6] || "",
              returnRate: rowData[7] || "",
              dividends: rowData[8] || "",
              totalReturn: rowData[9] || "",
              projectedValue: rowData[10] || "",
              assetType: rowData[11] || "",
              ticker: rowData[12] || "",
              passiveIncome: rowData[13] || "",
              references: rowData[14] || "",
            };
            scenarios.push(scenario);
          }
        });
      }
    }

    // Parse comparison section
    const comparisonMatch = cleanedContent.match(
      /## Comparación de Escenarios\s*([\s\S]*?)(?=---)/
    );
    const comparison = comparisonMatch ? comparisonMatch[1].trim() : "";

    // Parse risk analysis section
    const riskAnalysisMatch = cleanedContent.match(
      /## Análisis de Retornos Ajustados al Riesgo\s*([\s\S]*?)(?=---)/
    );
    const riskAnalysis = riskAnalysisMatch ? riskAnalysis[1].trim() : "";

    // Parse recommendations section
    const recommendationsMatch = cleanedContent.match(
      /## Recomendaciones de Implementación\s*([\s\S]*?)(?=---|\n## |$)/
    );
    const recommendations = recommendationsMatch
      ? recommendationsMatch[1].trim()
      : "";

    return {
      title,
      executiveSummary,
      scenarios,
      comparison,
      riskAnalysis,
      recommendations,
    };
  }, [markdownContent]);

  // Helper function to get risk color
  const getRiskColor = (risk: string): string => {
    const riskLower = risk.toLowerCase();
    if (
      riskLower.includes("alto") ||
      (riskLower.includes("muy") && riskLower.includes("alta"))
    ) {
      return "bg-red-500 text-white";
    }
    if (riskLower.includes("medio")) {
      return "bg-amber-500 text-white";
    }
    return "bg-green-600 text-white"; // Para riesgo bajo
  };

  // Helper function to format percentage strings
  const getPercentValue = (percentStr: string): number => {
    if (!percentStr || percentStr.toLowerCase().includes("n/a")) return 0;

    const match = percentStr.match(/(\d+(?:\.\d+)?)%?/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper function to format ticker display
  const formatTickerDisplay = (ticker: string, assetType: string): string => {
    if (ticker && assetType) {
      return `${ticker} (${assetType})`;
    } else if (ticker) {
      return ticker;
    }
    return "";
  };

  // Helper function to format return rate display
  const formatReturnRate = (rate: string): string => {
    if (!rate || rate.toLowerCase().includes("n/a")) return "N/A";

    // Ensure we have a percentage value
    if (!rate.includes("%")) {
      const numValue = parseFloat(rate);
      if (!isNaN(numValue)) {
        return `${numValue}%`;
      }
    }
    return rate;
  };

  // If no data was extracted, show placeholder message
  if (!sections.title && sections.scenarios.length === 0) {
    return (
      <div className="text-white">
        <p>
          No se pudo extraer el informe de inversión del formato proporcionado.
        </p>
      </div>
    );
  }

  return (
    <div className="investment-report text-white">
      <Card className="bg-gray-800/70 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">{sections.title}</CardTitle>
          <CardDescription className="text-gray-300">
            {sections.executiveSummary}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Scenarios Overview */}
          {sections.scenarios.length > 0 && (
            <div className="scenarios">
              <h3 className="text-lg font-medium mb-4 text-white">
                Escenarios de Inversión
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.scenarios.map((scenario, index) => (
                  <Card
                    key={index}
                    className="bg-gray-900/60 border-gray-700 overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-md text-white truncate">
                          {scenario.name}
                        </CardTitle>
                        <Badge
                          className={`${getRiskColor(
                            scenario.riskLevel
                          )} whitespace-nowrap ml-1`}
                        >
                          Riesgo {scenario.riskLevel}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300 break-words max-w-full overflow-hidden text-ellipsis">
                        {scenario.amount} -{" "}
                        {scenario.ticker ? scenario.ticker : ""}
                        {scenario.assetType ? `(${scenario.assetType})` : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white">
                            Retorno esperado
                          </span>
                          <span className="text-sm font-medium text-white">
                            {formatReturnRate(scenario.returnRate)}
                          </span>
                        </div>
                        <Progress
                          value={
                            scenario.returnRate &&
                            !scenario.returnRate.toLowerCase().includes("n/a")
                              ? getPercentValue(scenario.returnRate)
                              : 0
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="overflow-hidden">
                          <span className="text-gray-300">Monto:</span>
                          <span className="ml-1 text-white truncate">
                            {scenario.amount || "$0"}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-gray-300">Duración:</span>
                          <span className="ml-1 text-white truncate">
                            {scenario.duration || "N/A"}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-gray-300">Dividendos:</span>
                          <span className="ml-1 text-white truncate">
                            {scenario.dividends || "$0"}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-gray-300">Ing. Pasivo:</span>
                          <span className="ml-1 text-white truncate">
                            {scenario.passiveIncome
                              ? scenario.passiveIncome
                              : scenario.references
                              ? `[${scenario.references}]`
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <span className="text-gray-300 text-sm">
                          Valor proyectado:
                        </span>
                        <span className="ml-1 font-medium text-white block truncate">
                          {scenario.totalReturn && scenario.projectedValue
                            ? `${scenario.totalReturn} (${scenario.projectedValue})`
                            : scenario.projectedValue ||
                              scenario.totalReturn ||
                              scenario.assetType ||
                              "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-gray-700/50" />

          {/* Detailed Analysis */}
          <div className="analysis">
            <Accordion
              type="single"
              collapsible
              className="w-full bg-transparent"
            >
              {sections.comparison &&
                !sections.comparison.includes(
                  "| Identificación del Escenario |"
                ) &&
                sections.comparison
                  .split(/\d+\.\s*/)
                  .filter(Boolean)
                  .some((point) => point.trim().length > 10) && (
                  <AccordionItem value="comparison" className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4">
                      Comparación de Escenarios
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      <div className="space-y-3 text-sm">
                        {sections.comparison
                          .split(/\d+\.\s*/)
                          .filter(Boolean)
                          .filter(
                            (point) =>
                              !point.includes(
                                "| Identificación del Escenario |"
                              )
                          )
                          .filter((point) => point.trim().length > 10)
                          .map((point, index) => (
                            <div key={index} className="flex gap-2">
                              <span className="font-medium text-white">
                                {index + 1}.
                              </span>
                              <p className="text-gray-300">{point.trim()}</p>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

              {sections.riskAnalysis && (
                <AccordionItem value="risk" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4">
                    Análisis de Retornos Ajustados al Riesgo
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <div className="space-y-3 text-sm">
                      {sections.riskAnalysis
                        .split(/-\s*/)
                        .filter(Boolean)
                        .map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="text-white">•</span>
                            <p className="text-gray-300">{point.trim()}</p>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {sections.recommendations && (
                <AccordionItem
                  value="recommendations"
                  className="border-gray-700"
                >
                  <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4">
                    Recomendaciones de Implementación
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <div className="space-y-3 text-sm">
                      {sections.recommendations
                        .split(/-\s*/)
                        .filter(Boolean)
                        .map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="text-white">•</span>
                            <p
                              className="text-gray-300"
                              dangerouslySetInnerHTML={{
                                __html: point
                                  .trim()
                                  .replace(
                                    /\*\*([^*]+)\*\*/g,
                                    "<strong>$1</strong>"
                                  ),
                              }}
                            ></p>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {sections.scenarios.length > 0 && (
                <AccordionItem value="table" className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4">
                    Tabla Completa de Escenarios
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto w-full">
                      <Table className="w-full border border-gray-700/30 rounded-md">
                        <TableHeader className="bg-gray-800/50">
                          <TableRow>
                            <TableHead className="text-gray-300">
                              Escenario
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Estrategia
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Riesgo
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Monto
                            </TableHead>
                            <TableHead className="text-gray-300">
                              % Asig.
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Retorno
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Dividendos
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Ticker
                            </TableHead>
                            <TableHead className="text-gray-300">
                              Ing. Pasivo
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sections.scenarios.map((scenario, index) => (
                            <TableRow
                              key={index}
                              className="border-b border-gray-700/30"
                            >
                              <TableCell className="text-white">
                                {scenario.id}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.name}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.riskLevel}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.amount}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.allocation}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.returnRate}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.dividends}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.ticker}
                              </TableCell>
                              <TableCell className="text-white">
                                {scenario.passiveIncome}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-gray-700/40 pt-4 text-sm">
          <div className="text-gray-300">Datos procesados y analizados</div>
          <div>
            <Badge className="bg-gray-700 text-white">Informe Financiero</Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvestmentReport;
