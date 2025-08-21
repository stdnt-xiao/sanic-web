import asyncio
import json
import logging
import traceback

from agent.text2sql.analysis.data_render import data_render
from agent.text2sql.analysis.graph import create_graph
from agent.text2sql.state.agent_state import AgentState
from langgraph.graph.state import CompiledStateGraph

from constants.code_enum import DataTypeEnum

logger = logging.getLogger(__name__)


class Text2SqlAgent:
    """
    文本语言转sql
    """

    def __init__(self):
        pass

    async def run_agent(self, text, response):
        """
        :param text:
        :param response:
        :return:
        """
        try:
            initial_state = AgentState(user_query=text, attempts=0, correct_attempts=0)
            graph: CompiledStateGraph = create_graph()
            print("所有节点:", list(graph.nodes.keys()))
            current_step = None
            async for chunk_dict in graph.astream(initial_state, stream_mode="updates"):
                print(chunk_dict)
                #     print(f"metadata->:{metadata}")
                #     # print(f"metadata->:{chunk}")
                # if metadata["langgraph_node"] == "tools":
                #     tool_name = chunk.name or "未知工具"
                #     logger.info(f"工具调用结果:{chunk.content}")
                #     tool_use = "\n > 调用工具:" + tool_name + "\n\n"
                #     await response.write(self._create_response(tool_use))
                #     continue

                langgraph_step, step_value = next(iter(chunk_dict.items()))

                # if langgraph_step == "agent":
                #     continue

                # 检测到步骤变更
                if langgraph_step != current_step:
                    # 如果之前有打开的步骤，先关闭它
                    if current_step is not None and current_step not in ["summarize", "data_render"]:
                        await response.write(
                            "data:"
                            + json.dumps(
                                {
                                    "data": {
                                        "messageType": "continue",
                                        "content": "</details>\n\n",
                                    },
                                    "dataType": "t02",
                                },
                                ensure_ascii=False,
                            )
                            + "\n\n"
                        )

                    # 打开新的步骤 (除了 summarize 和 data_render)
                    if langgraph_step not in ["summarize", "data_render"]:
                        think_html = f"""<details style="color:gray;background-color: #f8f8f8;padding: 2px;border-radius: 6px;margin-top:5px;">
                                     <summary>{langgraph_step}...</summary>"""
                        formatted_message = {
                            "data": {
                                "messageType": "continue",
                                "content": think_html,
                            },
                            "dataType": "t02",
                        }
                        await response.write("data:" + json.dumps(formatted_message, ensure_ascii=False) + "\n\n")
                    current_step = langgraph_step

                if step_value:
                    if langgraph_step == "schema_inspector":
                        await response.write(self._create_response(f"共检索{len(step_value['db_info'])}张表."))
                        if hasattr(response, "flush"):
                            await response.flush()
                        await asyncio.sleep(0)
                    elif langgraph_step == "llm_reasoning":
                        await response.write(self._create_response(step_value["sql_reasoning"]))
                        if hasattr(response, "flush"):
                            await response.flush()
                        await asyncio.sleep(0)
                    elif langgraph_step == "sql_generator":
                        await response.write(self._create_response(step_value["generated_sql"]))
                        if hasattr(response, "flush"):
                            await response.flush()
                        await asyncio.sleep(0)
                    elif langgraph_step == "sql_executor":
                        await response.write(self._create_response("执行sql语句成功"))
                        if hasattr(response, "flush"):
                            await response.flush()
                        await asyncio.sleep(0)
                    elif langgraph_step == "summarize":
                        # 关闭之前的details标签（如果有的话）
                        if current_step is not None and current_step not in ["summarize", "data_render"]:
                            await response.write(
                                "data:"
                                + json.dumps(
                                    {
                                        "data": {
                                            "messageType": "continue",
                                            "content": "</details>\n\n",
                                        },
                                        "dataType": "t02",
                                    },
                                    ensure_ascii=False,
                                )
                                + "\n\n"
                            )
                        await response.write(self._create_response(step_value["report_summary"]))
                        if hasattr(response, "flush"):
                            await response.flush()
                        await asyncio.sleep(0)
                        current_step = langgraph_step
                    elif langgraph_step == "data_render":
                        # 关闭之前的details标签（如果有的话）
                        if current_step is not None and current_step not in ["summarize", "data_render"]:
                            await response.write(
                                "data:"
                                + json.dumps(
                                    {
                                        "data": {
                                            "messageType": "continue",
                                            "content": "</details>\n\n",
                                        },
                                        "dataType": "t02",
                                    },
                                    ensure_ascii=False,
                                )
                                + "\n\n"
                            )
                        await response.write(self._create_response(step_value["chart_url"]))
                        if hasattr(response, "flush"):
                            await response.flush()
                        await asyncio.sleep(0)
                        current_step = langgraph_step

            # 流结束时关闭最后的details标签
            if current_step is not None and current_step not in ["summarize", "data_render"]:
                await response.write(
                    "data:"
                    + json.dumps(
                        {
                            "data": {
                                "messageType": "continue",
                                "content": "</details>\n\n",
                            },
                            "dataType": "t02",
                        },
                        ensure_ascii=False,
                    )
                    + "\n\n"
                )

        except Exception as e:
            traceback.print_exception(e)
            error_msg = f"处理过程中发生错误: {str(e)}"
            await response.write(self._create_response(error_msg, "error"))
            if hasattr(response, "flush"):
                await response.flush()

    @staticmethod
    def _create_response(
        content: str, message_type: str = "continue", data_type: str = DataTypeEnum.ANSWER.value[0]
    ) -> str:
        """封装响应结构"""
        res = {
            "data": {"messageType": message_type, "content": content},
            "dataType": data_type,
        }
        return "data:" + json.dumps(res, ensure_ascii=False) + "\n\n"
