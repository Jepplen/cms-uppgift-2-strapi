'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.profile.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.profile.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.profile });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [profile] = await strapi.services.profile.find({
      id: ctx.params.id,
      'author.id': ctx.state.user.id,
    });

    if (!profile) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.profile.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.profile.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.profile });
  },
};