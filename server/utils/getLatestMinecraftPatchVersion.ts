import compareVersion from './compareVersion'
import getMinecraftVersions from './getMinecraftVersions'

export default async function (minecraft: string) {
  const versions = await getMinecraftVersions()
  const matchingVersions = versions.filter(
    version => version === minecraft || version.startsWith(`${minecraft}.`)
  )

  return matchingVersions.sort(compareVersion)[0] ?? minecraft
}
