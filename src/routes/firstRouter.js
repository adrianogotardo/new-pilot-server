import { Router } from "express";

const firstRouter = Router();
const PATH = "/";

firstRouter.get(`${PATH}409`,
    () => {
        throw {
            type: "conflict",
            message: "Erro do tipo 'conflito' gerado pela rota GET"
        }
    }
);

firstRouter.get(`${PATH}404`,
    () => {
        throw {
            type: "not_found",
            message: "Erro do tipo 'não encontrado' gerado pela rota GET"
        }
    }
);

firstRouter.get(`${PATH}401`,
    () => {
        throw {
            type: "unauthorized",
            message: "Erro do tipo 'não autorizado' gerado pela rota GET"
        }
    }
);

firstRouter.get(`${PATH}422`,
    () => {
        throw {
            type: "unprocessable_entity",
            message: "Erro do tipo 'entidade improcessável' gerado pela rota GET"
        }
    }
);

firstRouter.get(`${PATH}500`,
    () => {
        throw {
            type: "internal_server_error",
            message: "Erro do tipo 'erro interno do servidor' gerado pela rota GET"
        }
    }
);

firstRouter.get(`${PATH}no-message`,
    () => {
        throw {
            type: "not_found"
        }
    }
)

firstRouter.get(`${PATH}no-type`,
    () => {
        throw {
            type: "unknown"
        }
    }
)

export default firstRouter;