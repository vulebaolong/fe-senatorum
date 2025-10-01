#!/bin/bash
set -euo pipefail

### ====== CONFIG ======
IMAGE="img-fe_senatorum"
CONTAINER="con-fe_senatorum"
ENV_FILE="${WORKSPACE}/.env"
HOST_PORT=3001
APP_PORT=3000

### ====================
log() { echo -e ">>> $*"; }

log "1) Stop container FE nếu đang chạy..."
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  docker stop "${CONTAINER}"
fi

log "1.1) Xóa container FE nếu tồn tại..."
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  docker rm "${CONTAINER}"
  log "Đã xóa container ${CONTAINER}"
fi

log "2) Backup image hiện tại (nếu có) từ :latest -> :backup..."
if docker image inspect "${IMAGE}:latest" >/dev/null 2>&1; then
  docker tag "${IMAGE}:latest" "${IMAGE}:backup"
  log "Đã gắn tag backup: ${IMAGE}:backup"
else
  log "Không tìm thấy ${IMAGE}:latest — bỏ qua bước backup (có thể là lần deploy đầu)."
fi

log "3) Nạp biến từ .env (nếu có) để truyền build-arg..."
if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  set -a; . "${ENV_FILE}"; set +a
  log "Đã nạp ${ENV_FILE}"
else
  log "⚠️ Không thấy ${ENV_FILE}. Vẫn build nhưng các build-arg có thể rỗng."
fi

log "3.1) Dump env đã nạp:"
env | grep -E 'NEXT_PUBLIC_|WORKSPACE|NODE_ENV' || true

log "4) Build image mới"
docker build  \
  --build-arg NEXT_PUBLIC_BASE_DOMAIN_BE=$NEXT_PUBLIC_BASE_DOMAIN_BE \
  --build-arg NEXT_PUBLIC_BASE_DOMAIN_FE=$NEXT_PUBLIC_BASE_DOMAIN_FE \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
  --build-arg NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY=$NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY \
  --build-arg NEXT_PUBLIC_IS_PRODUCTION=$NEXT_PUBLIC_IS_PRODUCTION \
  --pull -t "$IMAGE:latest" -f "$WORKSPACE/Dockerfile" "$WORKSPACE"

log "5) Build OK → dọn tất cả dangling images (mọi project)..."
docker image prune -f

log "5) Triển khai FE dùng image mới..."
docker run -d --name "${CONTAINER}" \
  -p "${HOST_PORT}:${APP_PORT}" \
  "${IMAGE}:latest"
  
log "6) Kiểm tra container FE đã chạy..."
sleep 2
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "❌ FE chưa chạy! Giữ lại ${IMAGE}:backup để rollback."
  exit 1
fi

# (Tuỳ chọn) Nếu mọi thứ OK, xóa luôn backup để nhẹ máy.
# Comment dòng dưới nếu muốn giữ lại khả năng rollback nhanh.
if docker image inspect "${IMAGE}:backup" >/dev/null 2>&1; then
  log "7) Xóa image backup vì deploy thành công."
  docker rmi "${IMAGE}:backup" || true
fi

log "✅ Hoàn tất: ${CONTAINER} đang chạy với ${IMAGE}:latest trên port ${HOST_PORT}"