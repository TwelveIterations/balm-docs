import getNeoForgeVersion from '~~/server/utils/getNeoForgeVersion'
import getNeoFormVersion from '~~/server/utils/getNeoFormVersion'
import getForgeVersion from '~~/server/utils/getForgeVersion'
import getFabricVersion from '~~/server/utils/getFabricVersion'
import getLatestMinecraftPatchVersion from '~~/server/utils/getLatestMinecraftPatchVersion'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const requestedMinecraft = query.minecraft as string
  if (!requestedMinecraft || typeof requestedMinecraft !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'minecraft should be a string'
    })
  }
  const allowSnapshots = query.allowSnapshots === 'true'

  const minecraft = await getLatestMinecraftPatchVersion(requestedMinecraft)

  const getJavaVersionForMinecraft = (minecraftVersion: string) => {
    switch (minecraftVersion) {
      case '26.1':
      case '26.2':
        return '25'
      default:
        return '21'
    }
  }

  return {
    minecraft,
    neoforge: await getNeoForgeVersion(requestedMinecraft),
    neoform: await getNeoFormVersion(minecraft),
    fabric: await getFabricVersion(minecraft),
    forge: await getForgeVersion(minecraft),
    balm: await getNexusVersion(requestedMinecraft, 'balm-common', { allowSnapshots }),
    java: getJavaVersionForMinecraft(requestedMinecraft),
    kuma: await getNexusVersion(requestedMinecraft == '1.21.1' ? '1.21.0' : requestedMinecraft, 'kuma-api-common')
  }
})
