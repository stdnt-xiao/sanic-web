import os

from langchain.chat_models import init_chat_model
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from agent.text2sql.state.agent_state import AgentState


async def data_render(state: AgentState):
    """
    数据图表渲染
    mcphub 按group指定查询AntV-chart工具 减少上下文token
    :return:
    """
    client = MultiServerMCPClient(
        {
            "mcphub-sse": {
                "url": "http://localhost:3300/mcp/f635fd21-2f44-4a99-8a92-f778b4d3607f",
                "transport": "streamable_http",
            }
        }
    )

    # 过滤工具减少token和大模型幻觉问题
    char_type_ = state["char_type"]
    tools = await client.get_tools()
    tools = [tool for tool in tools if tool.name == char_type_]

    llm = init_chat_model(
        model="openai:qwen-plus",
        temperature=0.5,
        base_url=os.getenv("MODEL_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1"),
        api_key=os.getenv("MODEL_API_KEY"),
    )

    result_data = state["execution_result"]
    chart_agent = create_react_agent(
        model=llm,
        tools=tools,
        prompt=f"""
            你是一个经验丰富的BI专家,擅长根据原始数据选择合适的mcp图表工具进行渲染.
            请根据原始数据进行选择，并返回markdown格式的图表图片的url.
            ----
            {result_data}
            ----
          """,
    )

    result = await chart_agent.ainvoke(
        {"messages": [("user", "根据原始数据选择合适的mcp图表工具进行渲染")]},
        config={"configurable": {"thread_id": "chart-render"}},
    )

    state["chart_url"] = result["messages"][-1].content

    return state
