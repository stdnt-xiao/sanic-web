#!/bin/bash

# deploy_and_init.sh - 自动化部署和初始化脚本

# 不再使用 set -e，这样脚本在遇到错误时不会立即退出
# set -e  # 遇到错误时退出

echo "🚀 开始部署和初始化流程..."

# 日志记录函数
log_error() {
    echo "❌ 错误: $1" >&2
    echo "$(date): 错误 - $1" >> error.log
}

log_info() {
    echo "$1"
    echo "$(date): 信息 - $1" >> deploy.log
}

# 1. 创建volume目录和mcp_settings.json文件
log_info "📁 创建volume目录和配置文件..."
if ! mkdir -p ./volume/mcp-data; then
    log_error "无法创建目录 ./volume/mcp-data"
fi

if ! touch ./volume/mcp-data/mcp_settings.json; then
    log_error "无法创建文件 ./volume/mcp-data/mcp_settings.json"
fi

# 2. 启动所有服务
log_info "🐳 启动Docker服务..."
if ! docker-compose up -d; then
    log_error "Docker服务启动失败"
fi

# 3. 检查Python环境
log_info "🔍 检查Python环境..."
if ! command -v python3 &> /dev/null; then
    log_error "未检测到Python环境"
    log_info "请先安装Python:"
    log_info "Ubuntu/Debian: sudo apt update && sudo apt install python3 python3-pip -y"
    log_info "CentOS/RHEL: sudo yum install python3 python3-pip -y"
    log_info "macOS: brew install python3"
    log_info "或者访问 https://www.python.org/downloads/ 下载安装包"
fi

if ! command -v pip3 &> /dev/null; then
    log_error "未检测到pip3工具"
    log_info "请先安装pip3:"
    log_info "Ubuntu/Debian: sudo apt install python3-pip -y"
    log_info "CentOS/RHEL: sudo yum install python3-pip -y"
    log_info "macOS: pip3应该随Python一起安装，或使用: python3 -m ensurepip --upgrade"
fi

if command -v python3 &> /dev/null; then
    log_info "✅ Python环境检查通过 (版本: $(python3 --version))"
fi

# 4. 安装Python依赖
log_info "🐍 安装Python依赖..."
if ! pip3 install pymysql py2neo; then
    log_error "Python依赖安装失败"
fi

# 5. 循环检查mysql和neo4j-apoc容器是否启动成功
log_info "🔍 检查服务启动状态..."

# 检查容器是否运行
wait_for_container() {
    local container_name=$1
    local max_attempts=30
    local attempt=1

    log_info "⏳ 等待 $container_name 启动..."

    while [ $attempt -le $max_attempts ]; do
        if [ "$(docker inspect -f {{.State.Running}} $container_name 2>/dev/null)" = "true" ]; then
            log_info "✅ $container_name 已成功启动"
            return 0
        fi
        log_info "⏳ $container_name 尚未启动，第 $attempt/$max_attempts 次尝试..."
        attempt=$((attempt + 1))
        sleep 10
    done

    log_error "$container_name 启动超时"
    return 1
}

# 检查MySQL服务是否真正可用
check_mysql_ready() {
    local max_attempts=30
    local attempt=1

    log_info "⏳ 等待 MySQL 服务准备就绪..."

    while [ $attempt -le $max_attempts ]; do
        if docker exec chat-db mysqladmin ping --silent >/dev/null 2>&1; then
            log_info "✅ MySQL 服务已准备就绪"
            return 0
        fi
        log_info "⏳ MySQL 尚未准备就绪，第 $attempt/$max_attempts 次尝试..."
        attempt=$((attempt + 1))
        sleep 5
    done

    log_error "MySQL 服务准备超时"
    return 1
}

# 检查指定端口是否可用
check_port_available() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    log_info "⏳ 检查 $service_name 端口 $port 是否可用..."

    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port; then
            log_info "✅ $service_name 端口 $port 已开放"
            return 0
        fi
        log_info "⏳ $service_name 端口 $port 尚未开放，第 $attempt/$max_attempts 次尝试..."
        attempt=$((attempt + 1))
        sleep 5
    done

    log_error "$service_name 端口 $port 检查超时"
    return 1
}

# 等待MySQL和Neo4j服务启动，并检查MySQL是否真正可用以及端口是否开放
container_mysql_ok=true
container_neo4j_ok=true
mysql_ready_ok=true
port_mysql_ok=true
port_neo4j_ok=true

wait_for_container "chat-db" || container_mysql_ok=false
wait_for_container "neo4j-apoc" || container_neo4j_ok=true
check_mysql_ready || mysql_ready_ok=false
check_port_available "MySQL" 13006 || port_mysql_ok=false
check_port_available "Neo4j" 7687 || port_neo4j_ok=false

# 6. 执行数据初始化脚本
if $container_mysql_ok && $container_neo4j_ok && $mysql_ready_ok && $port_mysql_ok && $port_neo4j_ok; then
    log_info "📊 等待服务稳定 (30秒)..."
    sleep 30  # 等待30秒以确保服务完全就绪

    log_info "📊 执行数据初始化..."
    if [ -f "./init_data.sh" ]; then
        # 添加重试机制
        max_attempts=3
        attempt=1

        while [ $attempt -le $max_attempts ]; do
            if bash ./init_data.sh; then
                log_info "🎉 部署和初始化完成！"
                break
            else
                if [ $attempt -eq $max_attempts ]; then
                    log_error "初始化失败，已重试 $max_attempts 次"
                    exit 1
                else
                    log_info "⚠️  初始化失败，第 $attempt 次重试..."
                    attempt=$((attempt + 1))
                    sleep 10
                fi
            fi
        done
    else
        log_error "初始化脚本 init_data.sh 不存在"
    fi
else
    log_error "服务启动失败，无法执行数据初始化"
    log_info "各服务状态:"
    log_info "- MySQL容器启动: $container_mysql_ok"
    log_info "- Neo4j容器启动: $container_neo4j_ok"
    log_info "- MySQL服务就绪: $mysql_ready_ok"
    log_info "- MySQL端口可用: $port_mysql_ok"
    log_info "- Neo4j端口可用: $port_neo4j_ok"
fi
