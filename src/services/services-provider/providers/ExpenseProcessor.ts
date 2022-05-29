// import { ExpenseProcessorTypes } from "../../../types";
// import { ExpenseProcessor } from "../../expense-processor";
// import { ServicesProvider } from "../services-provider";

// export default {
//   Live: async (
//     configuration: any,
//     SP: ServicesProvider
//   ): Promise<ExpenseProcessorTypes.IExpenseProcessor> => {
//     const logger = await SP.Logger();
//     const accountingService = await SP.Accounting();
//     const config = await SP.Config();

//     const options: ExpenseProcessorTypes.ExpenseProcessorOptions = {
//       ...configuration,
//       expenseCategoryCategoryMap: (await config.getObject(
//         "EXPENSE_CATEGORY_CATEGORY_MAP"
//       )) as ExpenseProcessorTypes.CategoryMap,
//       expenseCategoryNameMap: (await config.getObject(
//         "EXPENSE_CATEGORY_NAME_MAP"
//       )) as ExpenseProcessorTypes.CategoryMap,
//       expenseSheetsPath: "../../public/expense-sheets",
//     };

//     try {
//       if (!SP.ExpesnseProcessor) {
//         const expenseProcessor = new ExpenseProcessor(
//           accountingService,
//           options,
//           logger
//         );

//         SP.setProvider(expenseProcessor, "ExpesnseProcessor");
//       }
//       return SP.ExpesnseProcessor;
//     } catch (error) {
//       logger.error(
//         `Something happend while trying to load Expense Processor from Services, error: ${error}`
//       );
//       throw error;
//     }
//   },
// };
