import logging

from langgraph.graph import StateGraph, END
from langgraph.graph.state import CompiledStateGraph
from agent.text2sql.analysis.data_render import data_render
from agent.text2sql.analysis.reasoning import create_reasoning_steps
from agent.text2sql.analysis.summarizer import summarize
from agent.text2sql.database.db_service import DatabaseService
from agent.text2sql.sql.generator import sql_generate
from agent.text2sql.state.agent_state import AgentState

logger = logging.getLogger(__name__)


def create_graph():
    """
    :return:
    """
    graph = StateGraph(AgentState)

    graph.add_node("schema_inspector", DatabaseService.get_table_schema)
    graph.add_node("llm_reasoning", create_reasoning_steps)
    graph.add_node("sql_generator", sql_generate)
    graph.add_node("sql_executor", DatabaseService.execute_sql)
    graph.add_node("data_render", data_render)
    graph.add_node("summarize", summarize)

    graph.set_entry_point("schema_inspector")
    graph.add_edge("schema_inspector", "llm_reasoning")
    graph.add_edge("llm_reasoning", "sql_generator")
    graph.add_edge("sql_generator", "sql_executor")
    graph.add_edge("sql_executor", "summarize")
    graph.add_edge("summarize", "data_render")
    graph.add_edge("data_render", END)

    graph_compiled: CompiledStateGraph = graph.compile()
    return graph_compiled
