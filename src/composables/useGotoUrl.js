import { useRouter } from 'vue-router'

export function useGotoUrl() {
  const router = useRouter()

  function gotoUrl(url) {
    router.push(url)
  }

  return { gotoUrl }
}